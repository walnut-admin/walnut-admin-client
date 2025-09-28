<script lang="ts" setup generic="T extends IModels.Base">
import type { StringOrNumber } from 'easy-fns-ts'
import type { WCrud } from './types'
import type { IModels } from '@/api/models'
import type { WForm } from '@/components/UI/Form'
import type { WTable } from '@/components/UI/Table'
import { isEmpty, pick } from 'lodash-es'
import { extractDefaultFormDataFromSchemas } from '@/components/UI/Form/src/utils'
import { useSafeForm } from './useSafeForm'

const props = withDefaults(defineProps<WCrud.Props<T>>(), {
  strictFormData: false,
})

const emit = defineEmits<WCrud.Emits<T>>()

const crudPropsCtx = useProps<WCrud.Props<T>>(props)

const { setProps, getProps } = crudPropsCtx

// ref
const actionType = ref<IActionType>('create')

// create/update form data
const { stateRef: formData, resetState: resetFormData, commit: commitFormData } = useState<T>({} as T)

// safe form logic
const { getIsFormModified, onClearStorage, onInitStorage } = useSafeForm(formData, getProps, actionType)

const defaultFormDataGenerated = ref(false)
// this is necessary, otherwise reset won't work
function onInitFormData() {
  if (defaultFormDataGenerated.value)
    return
  const initialFormData = extractDefaultFormDataFromSchemas(getProps.value.formProps!.schemas!)
  formData.value = Object.assign(formData.value!, initialFormData)
  // make this as default form data
  commitFormData()
  defaultFormDataGenerated.value = true
  console.log('[CRUD] Default form data generated', formData.value)
}

// api
const getBaseApi = computed(() => getProps.value.baseAPI!)

// get create/update form data
const getFormData = computed(() =>
  getProps.value.strictFormData ? pick(formData.value, ([...getProps.value.formProps?.schemas?.filter(i => i.formProp?.path).map(i => i.formProp?.path) as (keyof T)[], '_id'])) : formData.value,
)

// get table props
const getTableProps = computed((): WTable.Props<T> => ({
  ...getProps.value.tableProps,

  apiProps: {
  // onBeforeRequest: isFunction(getProps.value.onBeforeRequest)
  //   ? (query) => {
  //       return getProps.value.onBeforeRequest!(query)!
  //     }
  //   : undefined,

    listApi: getBaseApi.value?.list.bind(getBaseApi.value),

    deleteApi: getBaseApi.value?.delete.bind(getBaseApi.value),

    deleteManyApi: getBaseApi.value?.deleteMany.bind(getBaseApi.value),
  },
}))

// table
const [
  registerTable,
  {
    onApiList,
    onApiDelete,
    onApiDeleteMany,
    onGetApiListParams,
    onSetDefaultQueryFormData,
  },
] = useTable<T>(getTableProps)

// get form props
const getFormProps = computed((): WForm.Props<T> => ({
  ...getProps.value.formProps,

  dialogProps: {
    ...getProps.value.formProps?.dialogProps,
    width: getProps.value.formProps?.dialogProps?.width ?? '500px',
    actionType: actionType.value,
    closeConfirm: getIsFormModified.value,

    // create/update confirm
    onYes: async (apiHandler) => {
      await apiHandler(
        // Form API Solution 1
        getBaseApi.value[actionType.value].bind(getBaseApi.value),
        // Form API Solution 2
        // (data) => AppAxios.put({ url: '/system/locale', data }),
        getFormData.value,
      )
      resetFormData()
      onClearStorage()
      await onApiList()
    },
    onNo: (done) => {
      if ((getProps.value.safeForm && !getProps.value.safeFormFeedback) || actionType.value !== 'create') {
        resetFormData()
      }
      done()
    },
  },
}))

// form
const [registerForm, { onOpen }] = useForm(getFormProps)

// open create form
function onOpenCreateForm(generateDefaultFormData = true) {
  if (generateDefaultFormData) {
    // only generate default form data when open create dialog
    onInitFormData()
  }

  actionType.value = 'create'

  // feedback form
  nextTick(() => {
    onInitStorage()
  })

  onOpen()
}

// open and read form
async function onReadAndOpenUpdateForm(id: StringOrNumber) {
  actionType.value = 'update'

  const isDetail = !isEmpty(getFormProps.value.descriptionProps)
  if (isDetail) {
    actionType.value = 'detail'
  }

  onOpen(async (done) => {
    try {
      const res = await getBaseApi.value.read(id)
      formData.value = Object.assign(formData.value, res)

      if (!isDetail) {
        // feedback form
        nextTick(() => {
          onInitStorage()
        })
      }
    }
    finally {
      done()
    }
  })
}

// emit
emit('hook', {
  setProps,

  onOpenCreateForm,
  onReadAndOpenUpdateForm,
  onDeleteConfirm: onApiDelete,
  onDeleteManyConfirm: onApiDeleteMany,

  onGetFormData: () => formData,
  onGetActionType: () => actionType,

  onApiList,
  onGetApiListParams: () => onGetApiListParams(),
  onSetDefaultQueryFormData,
})

const appStoreSettingDev = useAppStoreSettingDev()
</script>

<template>
  <div :style="{ width: appStoreSettingDev.getCalcContentWidthWithPadding }">
    <!-- @vue-generic {T} -->
    <WTable @hook="registerTable" />

    <!-- @vue-generic {T} -->
    <WForm v-if="getProps.formProps" :model="formData" @hook="registerForm" />
  </div>
</template>
