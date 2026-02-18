<script lang="tsx" setup>
import type { DropdownOption } from 'naive-ui'
import type { IModels } from '@/api/models'
import type { IResponseData } from '@/api/response'
import { getSecurityTab1StatusAPI2, sendCodeForVerifyAPI, unBindUserIdentityAPI, updateUserIdentityStatusAPI } from '@/api/system/user_identity'
// TODO 111
import WIcon from '@/components/UI/Icon'
import WMeTabSecurityTab1Opaque from './opaque.vue'
import WMeTabSecurityTab1OTP from './otp.vue'

defineOptions({
  name: 'WMeTabSecurityTab1',
  defaultView: false,
})

const { t } = useAppI18n()
const userStoreProfile = useAppStoreUserProfile()

const opaqueRef = useTemplateRef('opaqueRef')
const optRef = useTemplateRef('optRef')
const status = ref<Partial<IResponseData.Me.Security.Tab1Status>>({})

function onSetPassword() {
  opaqueRef.value?.onOpen()
}

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
  const securityBound = res[type].bound && res[type].verified
  optRef.value?.onOpen(type, securityBound, res[type].maskedValue)
}

async function onUnbind(type: IModels.ISystemUserIdentityType) {
  await unBindUserIdentityAPI(type, 'login')
  useAppMsgSuccess()
  await onInit()
}

async function onChange(type: IModels.ISystemUserIdentityType) {
  const res = await getSecurityTab1StatusAPI2('security')
  const securityBound = res[type].bound && res[type].verified
  optRef.value?.onOpen(type, securityBound, res[type].maskedValue)
}

async function onVerify(type: IModels.ISystemUserIdentityType) {
  await sendCodeForVerifyAPI(type, 'login')
  optRef.value?.onOpenVerifyModal(type)
}

async function onInit() {
  const res = await getSecurityTab1StatusAPI2('login')
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
        purpose: 'login',
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
          :icon-props="{ icon: 'mdi:account' }"
          :button-props="{ type: status.password?.set ? 'info' : 'default' }"
        />
      </template>
      <template #suffix>
        <n-button :type="status.password?.set ? 'primary' : 'warning'" size="small" @click="onSetPassword">
          {{ $t('app.base.set') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.opaque')"
        :description="status.password?.set ? $t('security.opaque.desc', { userName: userStoreProfile.getUserName }) : $t('security.opaque.desc.unset')"
        description-class="text-sm text-gray-400"
      />
      <WMeTabSecurityTab1Opaque ref="opaqueRef" />
    </n-list-item>

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

    <WMeTabSecurityTab1OTP ref="optRef" @success="onInit" />
  </n-list>
</template>
