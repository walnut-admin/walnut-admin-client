<script lang="tsx" setup>
import type { DropdownOption } from 'naive-ui'
import type { IModels } from '@/api/models'
import type { IResponseData } from '@/api/response'
import { getSecurityTab1StatusAPI2, sendCodeForVerifyAPI, unBindUserIdentityAPI, updateUserIdentityStatusAPI } from '@/api/system/user_identity'
// TODO 111
import WIcon from '@/components/UI/Icon'
import WMeTabSecurityTab1OTP from '../tab1/otp.vue'

defineOptions({
  name: 'WMeTabSecurityTab4',
  defaultView: false,
})

const { t } = useAppI18n()

const optRef = useTemplateRef('optRef')
const status = ref<Partial<IResponseData.Me.Security.Tab1Status>>({})

function getIconType(item?: IResponseData.Me.Security.Tab1Status['phoneNumber']) {
  if (item?.bound && item?.verified)
    return 'info'
  if (item?.bound && !item?.verified)
    return 'warning'
  return 'default'
}

function getDescription(item: IResponseData.Me.Security.Tab1Status['phoneNumber'], type: IModels.ISystemUserIdentityType) {
  if (!item?.bound) {
    if (type === 'phoneNumber') {
      return t('security.phone.desc')
    }
    if (type === 'emailAddress') {
      return t('security.email.desc')
    }
  }

  const value = item.maskedValue || '******'

  if (!item.verified) {
    return value + t('security.otp.unverify')
  }

  return value + t('security.otp.verified')
}

async function onBind(type: IModels.ISystemUserIdentityType) {
  const res = await getSecurityTab1StatusAPI2('security')
  optRef.value?.onOpen(type, true, res[type].maskedValue, false)
}

async function onUnbind(type: IModels.ISystemUserIdentityType) {
  await unBindUserIdentityAPI(type, 'security')
  useAppMsgSuccess()
  await onInit()
}

async function onChange(type: IModels.ISystemUserIdentityType) {
  const res = await getSecurityTab1StatusAPI2('security')
  optRef.value?.onOpen(type, true, res[type].maskedValue, false)
}

async function onVerify(type: IModels.ISystemUserIdentityType) {
  await sendCodeForVerifyAPI(type, 'security')
  optRef.value?.onOpenVerifyModal(type)
}

async function onInit() {
  const res = await getSecurityTab1StatusAPI2('security')
  status.value = Object.assign(status.value, res)
}

function dropdownOptions(type: IModels.ISystemUserIdentityType): DropdownOption[] {
  return [
    {
      label: status.value[type]?.status ? t('dict.status.false') : t('dict.status.true'),
      key: 0,
      icon: () => <WIcon icon={status.value[type]?.status ? 'mdi:toggle-switch-off-outline' : 'mdi:toggle-switch-outline'}></WIcon>,
      disabled: !status.value[type]?.bound || !status.value[type]?.verified,
    },
    {
      label: t('app.base.rebind'),
      key: 1,
      icon: () => <WIcon icon="mdi:link-variant"></WIcon>,
      disabled: !status.value[type]?.bound,
    },
    {
      label: t('app.base.verify'),
      key: 2,
      show: status.value[type]?.bound && !status.value[type]?.verified,
      icon: () => <WIcon icon="mdi:link-variant"></WIcon>,
    },
    {
      label: t('app.base.unbind'),
      key: 3,
      disabled: !status.value[type]?.bound && status.value[type]?.verified,
      icon: () => <WIcon icon="mdi:backup-restore"></WIcon>,
    },
  ]
}

async function onDropdownSelect(key: number, type: IModels.ISystemUserIdentityType) {
  if (key === 0) {
    const { confirmed } = await useAppConfirm(t('app.base.confirm'), { maskClosable: false })
    if (confirmed) {
      await updateUserIdentityStatusAPI({
        type,
        purpose: 'security',
        status: !status.value[type]?.status,
      })
      useAppMsgSuccess()
      await onInit()
    }
  }

  if (key === 1) {
    onChange(type)
  }

  if (key === 2) {
    onVerify(type)
  }

  if (key === 3) {
    const { confirmed } = await useAppConfirm(t('app.base.confirm'), { maskClosable: false })
    if (confirmed) {
      onUnbind(type)
    }
  }
}

onBeforeMount(onInit)
</script>

<template>
  <n-list hoverable clickable>
    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'mdi:cellphone-android' }"
          :button-props="{ type: getIconType(status.phoneNumber) }"
        />
      </template>

      <template #suffix>
        <!-- not bind yet: show bind button -->
        <n-button
          v-if="!status.phoneNumber?.bound"
          type="primary"
          size="small"
          @click="() => onBind('phoneNumber')"
        >
          {{ $t('app.base.bind') }}
        </n-button>

        <n-dropdown
          v-else
          trigger="hover"
          :options="dropdownOptions('phoneNumber')"
          :show-arrow="true"
          placement="top"
          @select="(key: number) => onDropdownSelect(key, 'phoneNumber')"
        >
          <n-button type="info" size="small">
            {{ $t('app.base.action') }}
          </n-button>
        </n-dropdown>
      </template>

      <n-thing
        :description="getDescription(status.phoneNumber!, 'phoneNumber')"
        description-class="text-sm text-gray-400"
      >
        <template #header>
          {{ $t('app.security.phoneNumber') }}

          <n-tag size="tiny" :type="status.phoneNumber?.status ? 'success' : 'warning'">
            {{ status.phoneNumber?.status ? $t('app.base.enabled') : $t('app.base.disabled') }}
          </n-tag>
        </template>
      </n-thing>
    </n-list-item>

    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'mdi:email' }"
          :button-props="{ type: getIconType(status.emailAddress) }"
        />
      </template>

      <template #suffix>
        <!-- not bind yet: show bind button -->
        <n-button
          v-if="!status.emailAddress?.bound"
          type="primary"
          size="small"
          @click="() => onBind('emailAddress')"
        >
          {{ $t('app.base.bind') }}
        </n-button>

        <n-dropdown
          v-else
          trigger="hover"
          :options="dropdownOptions('emailAddress')"
          :show-arrow="true"
          placement="top"
          @select="(key: number) => onDropdownSelect(key, 'emailAddress')"
        >
          <n-button type="info" size="small">
            {{ $t('app.base.action') }}
          </n-button>
        </n-dropdown>
      </template>

      <n-thing
        :description="getDescription(status.emailAddress!, 'emailAddress')"
        description-class="text-sm text-gray-400"
      >
        <template #header>
          {{ $t('app.security.emailAddress') }}

          <n-tag size="tiny" :type="status.emailAddress?.status ? 'success' : 'warning'">
            {{ status.emailAddress?.status ? $t('app.base.enabled') : $t('app.base.disabled') }}
          </n-tag>
        </template>
      </n-thing>
    </n-list-item>

    <WMeTabSecurityTab1OTP ref="optRef" purpose="security" @success="onInit" />
  </n-list>
</template>
