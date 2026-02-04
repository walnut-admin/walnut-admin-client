<script lang="ts" setup>
import type { IResponseData } from '@/api/response'
import { getSecurityTab1StatusAPI } from '@/api/system/user_me'
import WAccountSettingsTabSecurityTab1Opaque from './opaque.vue'

defineOptions({
  name: 'WAccountSettingsTabSecurityTab1',
  defaultView: false,
})

const { t } = useAppI18n()
const userStoreProfile = useAppStoreUserProfile()

const tab1Ref = useTemplateRef('tab1Ref')
const status = ref<IResponseData.Me.Security.Tab1Status>({
  opaque: false,
  phoneNumber: false,
  emailAddress: false,
})

function onClick(index: number) {
  if (index === 1) {
    tab1Ref.value?.onOpen()
  }

  if (index === 2) {
    useAppMsgWarning(t('app.base.wip'))
  }

  if (index === 3) {
    useAppMsgWarning(t('app.base.wip'))
  }
}

async function onInit() {
  const res = await getSecurityTab1StatusAPI()
  status.value = Object.assign(status.value, res)
}

onBeforeMount(onInit)
</script>

<template>
  <n-list hoverable clickable>
    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'mdi:account' }"
          :button-props="{ type: status.opaque ? 'primary' : 'default' }"
        />
      </template>
      <template #suffix>
        <n-button type="primary" size="small" @click="onClick(1)">
          {{ $t('app.base.set') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.opaque')"
        :description="status.opaque ? $t('app.security.opaque.desc', { userName: userStoreProfile.getUserName }) : $t('app.security.opaque.desc.unset')"
        description-class="text-sm text-gray-400"
      />
      <WAccountSettingsTabSecurityTab1Opaque ref="tab1Ref" />
    </n-list-item>

    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'mdi:cellphone-android' }"
          :button-props="{ type: status.phoneNumber ? 'primary' : 'default' }"
        />
      </template>
      <template #suffix>
        <n-button type="primary" size="small" @click="onClick(3)">
          {{ status.phoneNumber ? $t('app.base.unbind') : $t('app.base.bind') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.phoneNumber')"
        :description="status.phoneNumber ? $t('app.security.phoneNumber.desc') : $t('app.security.phoneNumber.desc.unset')"
        description-class="text-sm text-gray-400"
      />
    </n-list-item>

    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'mdi:email' }"
          :button-props="{ type: status.emailAddress ? 'primary' : 'default' }"
        />
      </template>
      <template #suffix>
        <n-button type="primary" size="small" @click="onClick(2)">
          {{ status.emailAddress ? $t('app.base.unbind') : $t('app.base.bind') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.emailAddress')"
        :description="status.emailAddress ? $t('app.security.emailAddress.desc') : $t('app.security.emailAddress.desc.unset')"
        description-class="text-sm text-gray-400"
      />
    </n-list-item>
  </n-list>
</template>
