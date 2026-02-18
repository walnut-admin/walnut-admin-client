<script lang="ts" setup>
import type { IResponseData } from '@/api/response'
import WAccountSettingsTabSecurityTab3Device from './device.vue'

defineOptions({
  name: 'WMeTabSecurityTab3',
  defaultView: false,
})

const { t } = useAppI18n()

const deviceModal = useTemplateRef('deviceModal')

const status = ref<IResponseData.Me.Security.Tab3Status>({

})

async function onClick(index: number) {
  if (index === 1) {
    await deviceModal.value?.onOpen()
  }

  if (index === 2) {
    useAppMsgWarning(t('app.base.wip'))
  }

  if (index === 3) {
    useAppMsgWarning(t('app.base.wip'))
  }
}

async function onInit() {
  // const res = await getSecurityTab3StatusAPI()
  // status.value = Object.assign(status.value, res)
}

onBeforeMount(onInit)
</script>

<template>
  <n-list hoverable clickable>
    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'mdi:devices' }"
          :button-props="{ type: 'primary' }"
        />
      </template>
      <template #suffix>
        <n-button type="primary" size="small" @click="onClick(1)">
          {{ $t('app.base.set') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.device')"
        :description="$t('app.security.device.desc')"
        description-class="text-sm text-gray-400"
      />
      <WAccountSettingsTabSecurityTab3Device ref="deviceModal" />
    </n-list-item>

    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'simple-icons:session' }"
          :button-props="{ type: 'primary' }"
        />
      </template>
      <template #suffix>
        <n-button type="primary" size="small" @click="onClick(3)">
          {{ $t('app.base.set') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.sessionStrategy')"
        :description="$t('app.security.sessionStrategy.desc')"
        description-class="text-sm text-gray-400"
      />
    </n-list-item>

    <n-list-item>
      <template #prefix>
        <WIconButton
          :icon-props="{ icon: 'carbon:password' }"
          :button-props="{ type: 'primary' }"
        />
      </template>
      <template #suffix>
        <n-button type="primary" size="small" @click="onClick(2)">
          {{ $t('app.base.set') }}
        </n-button>
      </template>
      <n-thing
        :title="$t('app.security.passwordStrategy')"
        :description="$t('app.security.passwordStrategy.desc')"
        description-class="text-sm text-gray-400"
      />
    </n-list-item>
  </n-list>
</template>
