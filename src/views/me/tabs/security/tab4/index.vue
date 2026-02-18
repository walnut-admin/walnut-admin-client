<script lang="ts" setup>
import type { IResponseData } from '@/api/response'
import { getSecurityTab1StatusAPI2 } from '@/api/system/user_identity'

defineOptions({
  name: 'WMeTabSecurityTab4',
  defaultView: false,
})

const { t } = useAppI18n()

const status = ref<Partial<IResponseData.Me.Security.Tab1Status>>({})

function onClick(index: number) {
  if (index === 1) {
    useAppMsgWarning(t('app.base.wip'))
  }

  if (index === 2) {
    useAppMsgWarning(t('app.base.wip'))
  }
}

async function onInit() {
  const res = await getSecurityTab1StatusAPI2('security')
  status.value = Object.assign(status.value, res)
}

onBeforeMount(onInit)
</script>

<template>
  <n-list hoverable clickable>
    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'mdi:cellphone-android' }"
          :button-props="{ type: status.phoneNumber?.bound ? 'info' : 'default' }"
        />
      </template>
      <template #suffix>
        <n-button :type="status.phoneNumber?.bound ? 'warning' : 'primary'" size="small" @click="onClick(3)">
          {{ status.phoneNumber?.bound ? $t('app.base.unbind') : $t('app.base.bind') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.phoneNumber')"
        :description="status.phoneNumber?.bound ? $t('app.security.phoneNumber.desc') : $t('app.security.phoneNumber.desc.unset')"
        description-class="text-sm text-gray-400"
      />
    </n-list-item>

    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'mdi:email' }"
          :button-props="{ type: status.emailAddress?.bound ? 'info' : 'default' }"
        />
      </template>
      <template #suffix>
        <n-button :type="status.emailAddress?.bound ? 'warning' : 'primary'" size="small" @click="onClick(2)">
          {{ status.emailAddress?.bound ? $t('app.base.unbind') : $t('app.base.bind') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.emailAddress')"
        :description="status.emailAddress?.bound ? $t('app.security.emailAddress.desc') : $t('app.security.emailAddress.desc.unset')"
        description-class="text-sm text-gray-400"
      />
    </n-list-item>
  </n-list>
</template>
