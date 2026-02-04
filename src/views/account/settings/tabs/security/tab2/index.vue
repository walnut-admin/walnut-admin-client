<script lang="tsx" setup>
import type { DropdownOption } from 'naive-ui'
import type { IResponseData } from '@/api/response'
import { authMfaTotpUpdateStatusAPI } from '@/api/auth/mfa'
import { getSecurityTab2StatusAPI } from '@/api/system/user_me'
// TODO 111
import WIcon from '@/components/UI/Icon'

defineOptions({
  name: 'WAccountSettingsTabSecurityTab2',
  defaultView: false,
})

const { t } = useAppI18n()

const loading = ref(false)
const status = ref<IResponseData.Me.Security.Tab2Status>({
  totp: {
    status: false,
    verified: false,
  },
  webauthn: {
    status: false,
    verified: false,
  },
})

const dropdownOptions = computed<DropdownOption[]>(() => {
  return [
    {
      label: status.value.totp.status ? t('dict.status.false') : t('dict.status.true'),
      key: 0,
      icon: () => <WIcon icon={status.value.totp.status ? 'mdi:toggle-switch-off-outline' : 'mdi:toggle-switch-outline'}></WIcon>,
    },
    {
      label: t('app.base.showQrcode'),
      key: 1,
      disabled: !status.value.totp.status,
      icon: () => <WIcon icon="mdi:qrcode"></WIcon>,
    },
    {
      label: t('app.base.rebind'),
      key: 2,
      disabled: !status.value.totp.status,
      icon: () => <WIcon icon="mdi:link-variant"></WIcon>,
    },
    {
      label: t('app.base.checkBackupCodes'),
      key: 3,
      disabled: !status.value.totp.status,
      icon: () => <WIcon icon="mdi:backup-restore"></WIcon>,
    },
  ]
})

async function onDropdownSelect(key: number) {
  if (key === 0) {
    const { confirmed } = await useAppConfirm(t('app.base.confirm'), { maskClosable: false })
    if (confirmed) {
      loading.value = true
      try {
        await authMfaTotpUpdateStatusAPI(!status.value.totp.status)
        useAppMsgSuccess()
        await onInit()
      }
      finally {
        loading.value = false
      }
    }
  }

  if ([1, 2, 3].includes(key))
    useAppMsgWarning(t('app.base.wip'))
}

function onOpenWebauthnModal() {
  useAppMsgWarning(t('app.base.wip'))
}

async function onInit() {
  const res = await getSecurityTab2StatusAPI()
  status.value = Object.assign(status.value, res)
}

onBeforeMount(onInit)
</script>

<template>
  <n-list hoverable clickable>
    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'teenyicons:otp-outline' }"
          :button-props="{ type: status.totp.status ? 'primary' : 'default' }"
        />
      </template>
      <template #suffix>
        <n-dropdown
          trigger="hover"
          :disabled="loading"
          :options="dropdownOptions"
          :show-arrow="true"
          placement="top"
          @select="onDropdownSelect"
        >
          <n-button type="info" size="small">
            {{ $t('app.base.action') }}
          </n-button>
        </n-dropdown>
      </template>
      <n-thing
        :title="$t('mfa.totp')"
        :description="$t('app.security.totp.desc')"
        description-class="text-sm text-gray-400"
      />
    </n-list-item>

    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'simple-icons:webauthn' }"
          :button-props="{ type: status.webauthn.verified ? 'primary' : 'default' }"
        />
      </template>
      <template #suffix>
        <n-button type="primary" size="small" @click="onOpenWebauthnModal">
          {{ $t('app.base.check') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('mfa.webauthn')"
        :description="status.webauthn.verified ? $t('app.security.webauthn.desc') : $t('app.security.webauthn.desc.unset')"
        description-class="text-sm text-gray-400"
      />
    </n-list-item>
  </n-list>
</template>
