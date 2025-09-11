<script lang="ts" setup>
import type { IResponseData } from '@/api/response'
import type { ICompUIDescriptionsItem } from '@/components/UI/Descriptions'
import { getNetworkInfoAPI } from '@/api/app/monitor/server'

defineOptions({
  name: 'AppMonitorServerNetwork',
  defaultView: false,
})

const { t } = useAppI18n()

const info = ref<IResponseData.App.Monitor.Network>()
const loading = ref(false)
const empty = ref(false)

const items = computed<ICompUIDescriptionsItem[]>(() =>
  Object.entries(info.value ?? {}).map(([k, v]) => ({
    label: t(`app.monitor.server.network.${k}`),
    value: v,
  })),
)

async function onInit() {
  loading.value = true

  try {
    const res = await getNetworkInfoAPI()

    if (Object.values(res).length) {
      info.value = res
    }
    else {
      empty.value = true
    }
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(onInit)
</script>

<template>
  <WCard
    :title="t('app.monitor.server.network')"
    size="small"
    :segmented="{
      content: true,
      footer: 'soft',
    }"
    header-preset="refresh"
    :loading="loading"
    @refresh="onInit"
  >
    <template v-if="!empty">
      <WDescriptions
        v-if="!loading"
        size="small"
        label-placement="left"
        bordered
        :column="1"
        :items="items"
        :label-style="{ width: '45%' }"
      />

      <n-space v-else vertical size="small">
        <n-skeleton
          v-for="i in 4"
          :key="i"
          size="small"
          height="36px"
          width="100%"
          :sharp="false"
        />
      </n-space>
    </template>

    <div v-else class="h-full flex items-center justify-center">
      <n-empty />
    </div>
  </WCard>
</template>
