<script lang="ts" setup>
import type { DataTableColumn } from 'naive-ui'
import type { IModels } from '@/api/models'
import type { WForm } from '@/components/UI/Form'
import type { IAxios } from '@/utils/axios/types'
import { banDeviceAPI, deviceAPI, getDeviceCurrentActiveUserAPI, getDeviceHistoryUsersAPI, lockDeviceAPI, unbanDeviceAPI, unlockDeviceAPI } from '@/api/system/device'
import { extractDefaultFormDataFromSchemas } from '@/components/UI/Form/src/utils'
import DeviceCard from './card.vue'

defineOptions({
  name: 'Device',
})

const auths = {
  READ: 'system:device:read',
  GET_CURRENT_USER: 'system:device:getCurrentUser',
  GET_HISTORY_USERS: 'system:device:getHistoryUsers',
  LOCK: 'system:device:lock',
  UNLOCK: 'system:device:unlock',
  BANNED: 'system:device:ban',
  UNBANNED: 'system:device:unban',
}

const { t } = useAppI18n()

const data = ref<IModels.SystemDevice[]>([])
const total = ref(0)
const loading = ref(false)
const {
  stateRef: listParams,
  resetState: resetListParams,
  commit: commitParams,
} = useState<IAxios.BaseListParams<IModels.SystemDevice>>({
  query: {} as IModels.SystemDevice,
  sort: [{ field: 'active', order: 'descend', priority: 9 }, { field: 'locked', order: 'descend', priority: 8 }, { field: 'banned', order: 'descend', priority: 7 }],
  page: {
    page: 1,
    pageSize: 8,
  },
})
const querySchemas: WForm.Schema.Item<IModels.SystemDevice>[] = [
  {
    type: 'Base:Input',
    formProp: {
      path: 'deviceName',
    },
    componentProp: {
      clearable: true,
      onKeyupEnter() {
        onApiList()
      },
    },
  },
  {
    type: 'Base:Input',
    formProp: {
      path: 'location',
    },
    componentProp: {
      clearable: true,
      onKeyupEnter() {
        onApiList()
      },
    },
  },
  {
    type: 'Extend:Query',
    componentProp: {

    },
  },
]

const defaultQuery = extractDefaultFormDataFromSchemas(querySchemas)

listParams.value.query = Object.assign(listParams.value.query!, defaultQuery)

commitParams()

const [register] = useForm<IModels.SystemDevice>({
  span: 6,
  showFeedback: false,
  labelWidth: 100,
  schemas: querySchemas,
})

async function onApiList() {
  loading.value = true

  try {
    const res = await deviceAPI.list(listParams.value)
    data.value = res.data
    total.value = res.total
  }
  finally {
    loading.value = false
  }
}

async function onUpdatePage(p: number) {
  listParams.value.page!.page = p
  await onApiList()
}
async function onUpdatePageSize(p: number) {
  listParams.value.page!.page = 1
  listParams.value.page!.pageSize = p
  await onApiList()
}

async function onQuery({ done }: WForm.Params.Dialog.FinishLoading) {
  try {
    await onApiList()
  }
  finally {
    done()
  }
}
async function onReset({ done }: WForm.Params.Dialog.FinishLoading) {
  try {
    resetListParams()
    await onApiList()
  }
  finally {
    done()
  }
}

const currentActiveUserFormData = ref<IModels.SystemUser>()
const [registerCurrentActiveUserForm, { onOpen: onOpenCurrentActiveUserModal }] = useForm<IModels.SystemUser>({
  dialogPreset: 'modal',
  baseRules: false,
  labelWidth: 120,
  xGap: 0,

  descriptionProps: {
    bordered: true,
    column: 2,
    colon: true,
  },

  dialogProps: {
    defaultButton: false,
    width: '50%',
    closable: true,
    autoFocus: false,
    fullscreen: false,
    title: computed(() => t('sys.device.currentSigninUser')),
  },

  schemas: [
    {
      type: 'Base:Input',
      formProp: {
        path: 'userName',
      },
      descriptionProp: {
        copy: true,
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        path: 'nickName',
      },
      descriptionProp: {
        copy: true,
      },
    },
  ],
})

const historyShow = ref(false)
const historyLoading = ref(false)
const historyData = ref<IModels.SystemUser[]>([])
const historyColumns: DataTableColumn[] = [
  {
    key: 'userName',
    title: () => t('app.base.userName'),
    align: 'center',
    titleAlign: 'center',
    width: 100,
  },
  {
    key: 'nickName',
    title: () => t('app.base.nickName'),
    align: 'center',
    titleAlign: 'center',
    width: 100,
  },
  {
    key: 'lastActiveAt',
    title: () => t('app.base.lastActiveAt'),
    align: 'center',
    titleAlign: 'center',
    width: 100,
  },
]

const detailFormData = ref<IModels.SystemDevice>()
const submitLoading = ref(false)
const [registerDetailForm, { onOpen: onOpenDetailModal, onClose: onCloseDetailModal }] = useForm<IModels.SystemDevice>({
  dialogPreset: 'drawer',
  baseRules: false,
  labelWidth: 120,
  xGap: 0,

  descriptionProps: {
    bordered: true,
    column: 2,
    colon: true,
  },

  dialogProps: {
    defaultButton: false,
    width: '50%',
    closable: true,
    autoFocus: false,
    title: computed(() => t('app.base.device') + t('app.base.detail')),
    footerButtons: [
      {
        textProp: computed(() => !detailFormData.value?.locked ? t('app.base.lockDevice') : t('app.base.unlockDevice')),
        auth: computed(() => !detailFormData.value?.locked ? auths.LOCK : auths.UNLOCK),
        debounce: 300,
        type: 'warning',
        loading: computed(() => submitLoading.value),
        disabled: computed(() => submitLoading.value),
        async onClick() {
          const { confirmed } = await useAppConfirm(t('app.base.confirm'))

          if (confirmed) {
            submitLoading.value = true
            try {
              await (!detailFormData.value?.locked ? lockDeviceAPI : unlockDeviceAPI)(detailFormData.value?._id as string)
              useAppMsgSuccess()
              onCloseDetailModal()
              onApiList()
            }
            finally {
              submitLoading.value = false
            }
          }
        },
      },
      {
        textProp: computed(() => !detailFormData.value?.banned ? t('app.base.banDevice') : t('app.base.unbanDevice')),
        auth: computed(() => !detailFormData.value?.banned ? auths.BANNED : auths.UNBANNED),
        debounce: 300,
        type: 'error',
        async onClick() {
          const { confirmed } = await useAppConfirm(t('app.base.confirm'))

          if (confirmed) {
            submitLoading.value = true
            try {
              await (!detailFormData.value?.banned ? banDeviceAPI : unbanDeviceAPI)(detailFormData.value?._id as string)
              useAppMsgSuccess()
              onCloseDetailModal()
              onApiList()
            }
            finally {
              submitLoading.value = false
            }
          }
        },
      },
      {
        textProp: computed(() => t('sys.device.currentSigninUser')),
        auth: auths.GET_CURRENT_USER,
        debounce: 300,
        type: 'info',
        disabled: computed(() => !detailFormData.value?.active),
        async onClick() {
          try {
            const res = await getDeviceCurrentActiveUserAPI(detailFormData.value?._id as string)
            currentActiveUserFormData.value = res
            onOpenCurrentActiveUserModal()
          }
          catch (error) {
            console.error(error)
          }
        },
      },
      {
        textProp: computed(() => t('sys.device.historySigninUser')),
        auth: auths.GET_HISTORY_USERS,
        debounce: 300,
        type: 'info',
        loading: computed(() => historyLoading.value),
        disabled: computed(() => historyLoading.value),
        async onClick() {
          historyLoading.value = true
          try {
            const res = await getDeviceHistoryUsersAPI(detailFormData.value?._id as string)
            historyData.value = res
            historyShow.value = true
          }
          finally {
            historyLoading.value = false
          }
        },
      },
    ],
  },

  schemas: [
    {
      type: 'Base:Input',
      formProp: {
        path: 'deviceId',
      },
      descriptionProp: {},
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'deviceName',
      },
      descriptionProp: {
        span: 1,
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'active',
        label: computed(() => t('app.base.status')),
      },
      descriptionProp: {
        type: 'tag',
        formatter: (_, formData) => formData?.active ? t('app.base.online') : t('app.base.offline'),
        typeProps: {
          type: computed(() => detailFormData.value?.active ? 'success' : 'default'),
        },
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'deviceInfo',
        label: computed(() => t('app.base.deviceInfo')),
      },
      descriptionProp: {
        type: 'json',
        typeProps: {
          height: '160px',
        },
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'hardwareInfo',
        label: computed(() => t('app.base.hardwareInfo')),
      },
      descriptionProp: {
        span: 1,
        type: 'json',
        typeProps: {
          height: '120px',
        },
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'locationInfo',
        label: computed(() => t('app.base.locationInfo')),
      },
      descriptionProp: {
        span: 1,
        type: 'json',
        typeProps: {
          height: '120px',
        },
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'sr',
      },
      descriptionProp: {
        span: 1,
        type: 'json',
        typeProps: {
          height: '100px',
        },
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'vp',
      },
      descriptionProp: {
        span: 1,
        type: 'json',
        typeProps: {
          height: '100px',
        },
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'geoLocation',
        label: computed(() => t('app.base.lngLat')),
      },
      descriptionProp: {
        formatter: (_, formData) => formData?.geoLocation?.coordinates?.join(',') as string,
      },
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'riskScore',
      },
      descriptionProp: {},
    },

    {
      type: 'Base:Input',
      formProp: {
        path: 'ipHistory',
        label: computed(() => t('app.base.ip')),
      },
      descriptionProp: {},
    },
  ],
})
async function onDetail(id?: string) {
  const res = await deviceAPI.read(id!)
  detailFormData.value = res
  onOpenDetailModal()
}

useKeepAliveEffect(() => {
  onApiList()
})
</script>

<template>
  <div class="grid grid-cols-24 m-2 gap-y-2">
    <div class="col-span-24">
      <WForm
        :disabled="loading"
        :model="listParams.query"
        @hook="register"
        @query="onQuery"
        @reset="onReset"
      />
    </div>

    <div
      class="grid col-span-24 grid-cols-1 gap-4 p-4 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <DeviceCard
        v-for="device in data"
        :key="device._id"
        :device="device"
        :detail-button-auth="auths.READ"
        @detail="onDetail"
      />
    </div>

    <n-pagination
      v-if="total > (listParams.page?.pageSize || 0)"
      class="col-span-24 col-start-16"
      :disabled="loading"
      :item-count="total"
      :page="listParams.page?.page"
      show-size-picker
      :page-sizes="[8, 16, 24, 32]"
      @update-page="onUpdatePage"
      @update-page-size="onUpdatePageSize"
    />

    <WAppAuthorize :value="auths.READ">
      <WForm :model="detailFormData" @hook="registerDetailForm" />
    </WAppAuthorize>

    <WAppAuthorize :value="auths.GET_CURRENT_USER">
      <WForm :model="currentActiveUserFormData" @hook="registerCurrentActiveUserForm" />
    </WAppAuthorize>

    <WAppAuthorize :value="auths.GET_HISTORY_USERS">
      <WModal
        v-model:show="historyShow"
        width="60%"
        :fullscreen="false"
        :default-button="false"
        display-directive="show"
        :loading="historyLoading"
        :title="$t('sys.device.historySigninUser')"
      >
        <n-data-table
          :columns="historyColumns"
          :data="historyData"
          bordered
          striped
          :single-line="false"
          :row-key="(row: any) => row._id"
        />
      </WModal>
    </WAppAuthorize>
  </div>
</template>
