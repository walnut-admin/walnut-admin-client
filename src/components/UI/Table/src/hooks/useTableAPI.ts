import type { NullableRecord, StringOrNumber } from 'easy-fns-ts'

import type { SorterMultiple } from 'naive-ui/es/data-table/src/interface'
import type { WTable } from '../types'

import type { ICompUITableHooksAPIListParams } from './useTableAPIListParams'
import type { IHooksUseProps } from '@/hooks/core/useProps'
import { isFunction, isNumber, isUndefined } from 'easy-fns-ts'
import { cloneDeep } from 'lodash-es'
import { extractDefaultFormDataFromSchemas } from '../../../Form/src/utils'
import {
  generateDefaultSortParams,
  generateSortParams,
} from '../utils'

export function useTableAPI<T>(
  inst: Ref<WTable.Inst.NDataTableInst | null>,
  propsCtx: IHooksUseProps<Partial<WTable.Props<T>>>,
  columns: Ref<WTable.Column<T>[]>,
  listParams: ICompUITableHooksAPIListParams<T>,
) {
  const { t } = useAppI18n()
  const userStorePermission = useAppStoreUserPermission()
  const { getProps: props, setProps } = propsCtx

  const { apiListParams, resetParams, commitParams } = listParams

  const checkedRowKeys = ref<StringOrNumber[]>([])

  // api list
  const onApiList = async () => {
    // no list auth, return
    if (!userStorePermission.hasPermission(props.value.auths?.list as string)) {
      useAppNotiError(t('sys.msg.noAuthority'))
      return
    }

    // start table loading
    setProps({ loading: true })

    // `onBeforeRequest`: excute it and set query value
    // won't commit this as default query form data
    const beforeRequestHook = props.value.apiProps?.onBeforeRequest
    if (isFunction(beforeRequestHook)) {
      const beforeHookQuery = await beforeRequestHook!(
        cloneDeep(apiListParams.value.query!),
      )

      apiListParams.value.query = Object.assign(apiListParams.value.query!, beforeHookQuery)
    }

    try {
      const res = await props.value.apiProps!.listApi!(apiListParams.value)

      setProps({
        // actually i'm thinking is this really a good choice? like mutate the proxyed props inside the component
        // @ts-expect-error haha
        data: computed(() => res.data),
        pagination: props.value.pagination === false
          ? false
          : {
              itemCount: res.total,
              page: apiListParams.value.page?.page,
              pageSize: apiListParams.value.page?.pageSize,
              showSizePicker: true,
              showQuickJumper: true,
              pageSizes: [10, 30, 50],
              pageSlot: 7,
              onUpdatePage: async (p) => {
                apiListParams.value.page!.page = p
                await onApiList()
              },
              onUpdatePageSize: async (p) => {
                apiListParams.value.page!.page = 1
                apiListParams.value.page!.pageSize = p
                await onApiList()
              },
              prefix: () => t('comp.pagination.total', { total: res.total }),
            },
      })
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setProps({ loading: false })
    }
  }

  // api delete (default)
  const onApiDelete = async (id: StringOrNumber) => {
    const res = await props.value.apiProps!.deleteApi!(id)
    useAppMsgSuccess()
    await onApiList()
    return res
  }

  // api deleteMany (default)
  const onApiDeleteMany = async () => {
    const { confirmed } = await useAppConfirm(t('app.base.confirm'))

    if (!confirmed)
      return

    const res = await props.value.apiProps!.deleteManyApi!(
      checkedRowKeys.value.join(','),
    )

    useAppMsgSuccess()

    await onApiList()

    // use `length = 0` can clear the arr
    checkedRowKeys.value.length = 0

    return res
  }

  // query event
  const onApiQuery: WTable.FinishLoadingCallback = async (params) => {
    apiListParams.value.page!.page = 1
    await onApiList()
    params?.done()
  }

  // reset event
  const onApiReset: WTable.FinishLoadingCallback = async ({ done }) => {
    resetParams()
    inst.value?.clearSorter()
    inst.value?.clearFilters()
    await onApiList()
    done()
  }

  // set default query form data
  // this will merge the newQueryFormData to current query form data
  // and commit this change as a default version
  const onSetDefaultQueryFormData = (newQueryFormData: NullableRecord<T>) => {
    // set default value to query
    apiListParams.value.query = Object.assign(apiListParams.value.query!, newQueryFormData)

    // commit change, make this version a default version
    commitParams()
  }

  // api list init
  const onApiListInit = async () => {
    if (!isFunction(props.value.apiProps?.listApi))
      return

    // handle params.query default
    if (
      !isUndefined(props.value.queryFormProps)
      && !isUndefined(props.value.queryFormProps?.schemas)
    ) {
      onSetDefaultQueryFormData(extractDefaultFormDataFromSchemas(props.value.queryFormProps!.schemas!))
    }

    // handle params.sort default
    if (columns.value.some(i => i.defaultSortOrder)) {
      apiListParams.value.sort = generateSortParams<T>(generateDefaultSortParams(columns.value))

      // commit change, make this version a default version
      commitParams()
    }

    await onApiList()
  }

  // sorter
  const onSorter = () => {
    if (columns.value?.some(i => isNumber((i.sorter as SorterMultiple)?.multiple))) {
      setProps({
        onUpdateSorter: async (sorts) => {
          if (!sorts)
            return
          apiListParams.value.sort = generateSortParams<T>(sorts)
          if (!isUndefined(props.value?.apiProps)) {
            await onApiList()
          }
        },
      })
    }
  }

  // filter
  const onFilter = () => {
    if (columns.value?.some(i => i.filter === true)) {
      setProps({
        onUpdateFilters: async (filters) => {
          if (!filters)
            return
          apiListParams.value.query = Object.assign(apiListParams.value.query!, filters)
          if (!isUndefined(props.value?.apiProps)) {
            await onApiQuery()
          }
        },
      })
    }
  }

  // checked row keys
  const onCheckedRowKeys = () => {
    if (columns.value?.map(i => i.type).includes('selection')) {
      setProps({
        onUpdateCheckedRowKeys: (rowKeys: StringOrNumber[]) => {
          checkedRowKeys.value = rowKeys
        },
      })
    }
  }

  useKeepAliveEffect(async () => {
    // Step 1
    // handle initial query form data
    await onApiListInit()

    // Step 2
    // handle sort params and event
    onSorter()

    // Step 3
    // handle preset dict column filter event
    onFilter()

    // Step 4
    // handle selection column to manage checkedRowKeys
    onCheckedRowKeys()
  })

  return {
    onApiList,
    onApiQuery,
    onApiReset,
    onApiDelete,
    onApiDeleteMany,
    checkedRowKeys,
    onSetDefaultQueryFormData,
  }
}
