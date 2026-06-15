import type { Recordable } from 'easy-fns-ts'
import type { DropdownOption, TagProps } from 'naive-ui'
import type { FilterOption } from 'naive-ui/es/data-table/src/interface'
import type { WTable } from '../types'
import type { IAxios } from '@/utils/axios/types'
import { omit } from 'lodash-es'
import { NA, NDropdown, NTag } from 'naive-ui'
import WAppNotAuthorized from '@/components/App/AppNotAuthorized'
// TODO 111
import WDictLabel from '@/components/Business/DictLabel'
import WMessage from '@/components/Extra/Message'

import WIcon from '@/components/UI/Icon'
import WIconButton from '@/components/UI/IconButton'
import { getBoolean, getFunctionBoolean } from '@/utils/shared'
import { getTableTranslated } from '../utils'

// Extend Naive UI columns
export function useTableColumns<T>(propsCtx: IHooksUseProps<WTable.Props<T>>, apiListParams: Ref<IAxios.BaseListParams<T>>) {
  const columns = ref<WTable.Column<T>[]>([])
  const { t } = useAppI18n()
  const userStorePermission = useAppStoreUserPermission()
  const { getProps: props, setProps } = propsCtx

  const builtInType = ['expand', 'selection']

  const transformColumn = (item: WTable.Column<T>) => {
    if (builtInType.includes(item.type!))
      return item

    return {
      ...item,
      _rawTitle: item.title,
      title: () => (
        <div class="flex flex-row flex-nowrap items-center justify-center gap-x-2">
          {getTableTranslated(props, item)}
          {item.titleHelpMessage && (
            <WMessage msg={getTableTranslated(props, item, true)}>
            </WMessage>
          )}
        </div>
      ),
    }
  }

  watchEffect(async () => {
    // @ts-expect-error computed error
    columns.value = props.value.columns
      ?.map(i => ({ ...i, _internalShow: i._internalShow ?? true }))
      .map((item) => {
        // default value override
        item.align = item.align ?? 'center'
        item._rawTitle = item.title as string

        const tItem = props.value.localeUniqueKey ? transformColumn(item) : item

        // sorter in control
        if (tItem.sorter) {
          const sortOrder = apiListParams.value.sort?.find(i => i.field === tItem.key)?.order
          if (sortOrder) {
            tItem.sortOrder = sortOrder
          }
        }

        // index based on apiListParams
        if (tItem.extendType === 'index') {
          return {
            ...tItem,
            title: t('app.base.index'),
            width: 70,
            render(_, index) {
              return (
                ((apiListParams.value.page?.page as number) - 1)
                * (apiListParams.value.page?.pageSize as number)
                + index
                + 1
              )
            },
          }
        }

        // link
        if (tItem.extendType === 'link') {
          return {
            ...tItem,
            render(p) {
              return <span onClick={() => tItem?.onClick!(p)}><NA>{tItem.formatter ? tItem.formatter(p) : (p as Recordable)[tItem.key] }</NA></span>
            },
          }
        }

        // tag
        if (tItem.extendType === 'tag') {
          return {
            ...tItem,
            render(p) {
              return (
                <NTag {...(tItem.tagProps ? tItem.tagProps(p) as TagProps : {})}>{tItem.formatter ? tItem.formatter(p) : p}</NTag>
              )
            },
          }
        }

        // dict
        if (tItem.extendType === 'dict') {
          return {
            ...tItem,

            // handle dict column title
            title: tItem.useDictNameAsTitle
              ? () => t(`dict.name.${tItem.dictType}`)
              : tItem.title,

            filterOptions: computed((): FilterOption[] =>
              tItem.filter
                ? getDictDataFromMap(tItem.dictType)?.map(i => ({
                  value: i.value,
                  label: t(i.label!),
                })) as FilterOption[]
                : [],
            ),

            render(p) {
              return <WDictLabel dictType={tItem.dictType} dictValue={(p as Recordable)[tItem.key]}></WDictLabel>
            },
          }
        }

        // action
        if (tItem.extendType === 'action') {
          const defaultBuiltInButtons: WTable.ExtendType.ActionButtons<T>[] = [
            {
              _builtInType: 'create',
              buttonProps: {
                auth: props.value.auths?.create,
                type: 'success',
                size: 'small',
                text: true,
                textProp: () => t('app.base.create'),
              },
              iconProps: {
                icon: 'ant-design:plus-outlined',
              },
            },
            {
              _builtInType: 'read',
              buttonProps: {
                auth: props.value.auths?.read,
                type: 'info',
                size: 'small',
                text: true,
                textProp: () => t('app.base.read'),
              },
              iconProps: {
                icon: 'ant-design:edit-outlined',
              },
            },
            {
              _builtInType: 'delete',
              buttonProps: {
                auth: props.value.auths?.delete,
                type: 'error',
                size: 'small',
                text: true,
                textProp: () => t('app.base.delete'),
              },
              iconProps: {
                icon: 'ant-design:delete-outlined',
              },
              confirm: true,
            },
            {
              _builtInType: 'detail',
              buttonProps: {
                auth: props.value.auths?.read,
                type: 'success',
                size: 'small',
                text: true,
                textProp: () => t('app.base.detail'),
              },
              iconProps: {
                icon: 'ant-design:eye-outlined',
              },
            },
          ]

          const builtInActions = tItem.columnBuiltInActions ?? []
          const extraActions = tItem.columnExtraActions ?? []
          const bs = builtInActions
            .concat(extraActions)
            .sort((a, b) => getBoolean(a._dropdown, false) - getBoolean(b._dropdown, false))
            .map((item) => {
              const button = defaultBuiltInButtons.find(b => b._builtInType === item._builtInType)
              return button ? Object.assign(button, item) : item
            })

          const renderDropdownEmpty: DropdownOption[] = [
            {
              type: 'render',
              key: 'empty',
              render: () => {
                return <div class="scale-80 px-2"><WAppNotAuthorized preset-width="100%" perset-height="100px"></WAppNotAuthorized></div>
              },
            },
          ]

          const hasAnyDropdown = bs.some(i => i._dropdown)
          const dropdownStates = hasAnyDropdown ? reactive<Map<number, boolean>>(new Map()) : null

          return {
            ...tItem,

            render(rowData, rowIndex) {
              const isShow = (i: WTable.ExtendType.ActionButtons<T>) => getFunctionBoolean(i._show, rowData)
              const isDisabled = (i: WTable.ExtendType.ActionButtons<T>) => getFunctionBoolean(i._disabled, rowData, false)

              // 统一处理按钮的显示和权限过滤
              const visibleButtons = bs
                .filter(i => isShow(i) && userStorePermission.hasPermission(i.buttonProps?.auth as string))
                .map(i => omit(i, '_show'))

              // 一次遍历分离 normal 和 dropdown 按钮
              const normalButtons: typeof visibleButtons = []
              const dropdownButtons: typeof visibleButtons = []
              visibleButtons.forEach((i) => {
                if (i._dropdown) {
                  dropdownButtons.push(omit(i, '_dropdown'))
                }
                else {
                  normalButtons.push(omit(i, '_dropdown'))
                }
              })

              const hasDropdownButtons = dropdownButtons.length > 0

              // 统一的按钮点击处理
              const handleButtonClick = async (i: WTable.ExtendType.ActionButtons<T>, inDropdown: boolean) => {
                await i.onPresetClick!(rowData, rowIndex)
                if (inDropdown && dropdownStates) {
                  dropdownStates.set(rowIndex, false)
                }
              }

              const renderButton = (i: WTable.ExtendType.ActionButtons<T>, inDropdown: boolean) => (
                <WIconButton
                  button-props={{
                    ...i.buttonProps,
                    disabled: isDisabled(i),
                    onClick: !i.confirm ? () => handleButtonClick(i, inDropdown) : null,
                  }}
                  icon-props={i.iconProps}
                  confirm={i.confirm}
                  onConfirm={() => handleButtonClick(i, inDropdown)}
                >
                </WIconButton>
              )

              const renderNormalButtons = normalButtons.map(i => renderButton(i, false))

              const dropdownOptions: DropdownOption[] = dropdownButtons.map(i => i.iconProps?.icon
                ? {
                    type: 'render',
                    key: i._builtInType,
                    disabled: isDisabled(i),
                    render: i?.iconProps?.icon ? () => <div class="mx-2">{renderButton(i, true)}</div> : undefined,
                  }
                : {
                    key: i._builtInType,
                    label: i.buttonProps?.textProp,
                    disabled: isDisabled(i),
                  })

              return (
                <div class="flex flex-row flex-nowrap items-center justify-center gap-x-2">
                  {renderNormalButtons}

                  {hasDropdownButtons
                    ? (
                        <NDropdown
                          size="small"
                          trigger="click"
                          show={dropdownStates?.get(rowIndex) ?? false}
                          onUpdateShow={v => dropdownStates?.set(rowIndex, v)}
                          options={dropdownOptions.length ? dropdownOptions : renderDropdownEmpty}
                          onSelect={(key) => {
                            const target = dropdownButtons.find(i => i._builtInType === key)
                            target && handleButtonClick(target, true)
                          }}
                        >
                          <div class="flex items-center justify-center">
                            <WIconButton
                              icon-props={{ icon: 'ant-design:more-outlined' }}
                              button-props={{ text: false }}
                            />
                          </div>
                        </NDropdown>
                      )
                    : null}
                </div>
              )
            },
          }
        }

        // icon
        if (tItem.extendType === 'icon') {
          return {
            ...tItem,
            width: 80,
            render() {
              return (
                <WIcon
                  width="24"
                  icon={tItem.extendIconName}
                >
                </WIcon>
              )
            },
          }
        }

        // formatter
        if (tItem?.formatter) {
          return {
            ...tItem,
            render(p) {
              return tItem.formatter ? tItem.formatter(p) : p
            },
          }
        }

        return tItem
      })
  })

  const onScrollX = () => {
    // first is naive column type
    // second is extend column type
    const whiteList = [
      builtInType,
      ['index', 'icon'],
    ]

    // get columns width in array
    const widths = props.value.columns
      ?.map((i) => {
        // expand/selection/index/icon default width is 80
        if (
          !whiteList[0].includes(i.type!)
          && !whiteList[1].includes(i.extendType!)
        ) {
          return i.width || i.minWidth
        }
        else {
          return 80
        }
      })
      .filter(Boolean)

    if (
      widths?.length !== 0
      && widths?.length === props.value.columns?.length
    ) {
      const w = widths?.reduce((p, c) => (p as number) + (c as number), 0)

      setProps({ scrollX: w })
    }
    else {
      console.warn('WTable', `Table with 'localeUniqueKey' ${props.value.localeUniqueKey} has a column without width. This may cause 'scrollX' calculate error.`)
    }
  }

  const onInitDict = async () => {
    if (props.value.columns?.some(i => i.extendType === 'dict')) {
      const usedDictTypes = props.value.columns?.filter(i => i.extendType === 'dict')?.map(i => (i as WTable.ExtendType.Dictionary<T>).dictType).filter(Boolean)
      await initDict(usedDictTypes)
    }
  }

  onMounted(() => {
    // auto handle scrollX
    onScrollX()

    // init dict
    onInitDict()
  })

  return columns
}
