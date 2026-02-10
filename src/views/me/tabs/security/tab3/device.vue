<script lang="ts" setup>
import type { IResponseData } from '@/api/response'
import { forceQuitUserDeviceAPI, listUserDevicesAPI, lockUserDeviceAPI, unlockUserDeviceAPI, updateUserDeviceNameAPI } from '@/api/system/user_device'

defineOptions({
  name: 'WAccountSettingsTabSecurityTab3Device',
  defaultView: false,
})

const { t } = useAppI18n()
const visible = ref(false)

const { stateRef: updateDeviceNameData, resetState: resetUpdateDeviceNameFormData } = useState({ deviceId: '', deviceName: '' })
const [registerUpdatePassword, { onOpen: onOpenUpdateDeviceNameModal }] = useForm<typeof updateDeviceNameData.value>({
  dialogPreset: 'modal',
  baseRules: true,
  labelWidth: 120,
  xGap: 0,

  dialogProps: {
    title: computed(() => t('app.security.device.updateName')),
    width: '40%',
    onYes: onUpdateDeviceNameYes,
    onNo: (done) => {
      resetUpdateDeviceNameFormData()
      done()
    },
  },

  schemas: [
    {
      type: 'Base:Input',
      formProp: {
        path: 'deviceName',
      },
      componentProp: {
        clearable: true,
        maxlength: 80,
      },
    },
  ],
})

const [register, { onApiList }] = useTable<IResponseData.System.UserDevice.List>({
  bordered: true,
  striped: true,
  rowKey: row => row.deviceId!,
  auths: {
    list: 'system:user:device:list',
  },
  apiProps: {
    listApi: listUserDevicesAPI,
  },
  headerLeftBuiltInActions: [
    {
      _builtInType: 'create',
      onPresetClick() {
        console.log('create')
      },
    },
    {
      _builtInType: 'delete',
      onPresetClick() {
        console.log('delete')
      },
    },
  ],
  columnSetting: false,
  maxHeight: 300,
  minHeight: 300,
  pagination: false,
  localeUniqueKey: 'app.base',
  columns: [
    {
      title: '#',
      key: 'key',
      render: (_, index) => {
        return `${index + 1}`
      },
      width: 40,
      fixed: 'left',
      locale: false,
    },
    {
      key: 'deviceName',
      fixed: 'left',
      minWidth: 240,
      extendType: 'tag',
      tagProps: row => ({
        type: row.current === true ? 'success' : 'info',
        size: 'small',
      }),
      formatter: row =>
        row.current === true
          ? `${row.deviceName} (Current)`
          : row.deviceName,
    },
    {
      title: computed(() => t('table.app.monitor.user.auth')),
      locale: false,
      key: 'auth',
      width: 160,
      extendType: 'tag',
      tagProps: row => ({
        type: row.auth === true ? 'success' : 'warning',
        size: 'small',
      }),
      formatter: row =>
        row.auth === true
          ? t('table.app.monitor.user.auth.true')
          : t('table.app.monitor.user.auth.false'),
      filter: true,
      filterMultiple: false,
      filterOptions: [
        {
          value: 'true',
          label: computed(() => t('table.app.monitor.user.auth.true')),
        },
        {
          value: 'false',
          label: computed(() => t('table.app.monitor.user.auth.false')),
        },
      ],
    },
    {
      title: computed(() => t('app.base.lock.status')),
      locale: false,
      key: 'locked',
      width: 160,
      extendType: 'tag',
      tagProps: row => ({
        type: row.locked === true ? 'success' : 'warning',
        size: 'small',
      }),
      formatter: row =>
        row.locked === true
          ? t('app.base.lock.true')
          : t('app.base.lock.false'),
      filter: true,
      filterMultiple: false,
      filterOptions: [
        {
          value: 'true',
          label: computed(() => t('app.base.lock.true')),
        },
        {
          value: 'false',
          label: computed(() => t('app.base.lock.false')),
        },
      ],
    },
    {
      key: 'deviceType',
      width: 120,
    },
    {
      key: 'location',
      width: 200,
    },
    {
      key: 'lastActiveAt',
      minWidth: 200,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      extendType: 'action',
      columnExtraActions: [
        {
          _builtInType: 'updateDeviceName',
          _dropdown: true,
          async onPresetClick(rowData) {
            updateDeviceNameData.value.deviceId = rowData.deviceId!
            updateDeviceNameData.value.deviceName = rowData.deviceName!
            onOpenUpdateDeviceNameModal()
          },
          buttonProps: {
            textProp: () => t('app.security.device.updateName'),
            type: 'info',
            size: 'small',
            auth: `system:user:device:updateName`,
          },
          iconProps: {
            icon: 'mdi:update',
          },
        },
        {
          _builtInType: 'lock',
          _dropdown: true,
          confirm: true,
          _disabled: row => !row.auth,
          _show: row => !row.locked,
          iconProps: {
            icon: 'mdi:lock-outline',
          },
          buttonProps: {
            auth: `system:user:device:lock`,
            type: 'warning',
            textProp: () => t('app.base.lockDevice'),
          },
          async onPresetClick(rowData) {
            await lockUserDeviceAPI({ deviceId: rowData.deviceId! })
            useAppMsgSuccess()
            const timeId = setTimeout(async () => {
              await onApiList()
              clearTimeout(timeId)
            }, 1000)
          },
        },
        {
          _builtInType: 'unlock',
          _dropdown: true,
          confirm: true,
          _disabled: row => !row.auth,
          _show: row => row.locked,
          iconProps: {
            icon: 'mdi:lock-open-variant-outline',
          },
          buttonProps: {
            auth: `system:user:device:lock`,
            type: 'warning',
            textProp: () => t('app.base.unlockDevice'),
          },
          async onPresetClick(rowData) {
            await unlockUserDeviceAPI({ deviceId: rowData.deviceId! })
            useAppMsgSuccess()
            const timeId = setTimeout(async () => {
              await onApiList()
              clearTimeout(timeId)
            }, 1000)
          },
        },
        {
          _builtInType: 'force-quit',
          _dropdown: true,
          confirm: true,
          _disabled: row => !row.auth,
          iconProps: {
            icon: 'ant-design:logout-outlined',
          },
          buttonProps: {
            auth: `system:user:device:forceQuit`,
            type: 'error',
            textProp: () => t('app.monitor.user.forceLogout'),
          },
          async onPresetClick(rowData) {
            await forceQuitUserDeviceAPI({ deviceId: rowData.deviceId! })
            useAppMsgSuccess()
            const timeId = setTimeout(async () => {
              await onApiList()
              clearTimeout(timeId)
            }, 1000)
          },
        },
      ],
      fixed: 'right',
    },
  ],
})

async function onUpdateDeviceNameYes(_: any, done: () => void) {
  try {
    await updateUserDeviceNameAPI({
      deviceId: updateDeviceNameData.value.deviceId,
      deviceName: updateDeviceNameData.value.deviceName,
    })
    useAppMsgSuccess()
    resetUpdateDeviceNameFormData()
    await onApiList()
  }
  finally {
    done()
  }
}

async function onOpen() {
  visible.value = true
}

defineExpose({
  onOpen,
})
</script>

<template>
  <WModal v-model:show="visible" :title="$t('sys.menu.user.device')" width="60%" height="60%" :fullscreen="false" :default-button="false">
    <!-- @vue-generic {IResponseData.System.UserDevice.List} -->
    <WTable @hook="register" />

    <WForm :model="updateDeviceNameData" @hook="registerUpdatePassword" />
  </WModal>
</template>
