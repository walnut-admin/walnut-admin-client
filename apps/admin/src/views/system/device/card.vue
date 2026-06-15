<script lang="ts" setup>
import type { IModels } from '@/api/models'

defineOptions({
  name: 'DeviceCard',
})

defineProps<{ device: IModels.SystemDevice, detailButtonAuth: string }>()

defineEmits<{ detail: [id?: string] }>()
</script>

<template>
  <NCard
    :bordered="false"
    size="medium"
    class="group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 dark:bg-neutral-900 hover:shadow-lg"
  >
    <!-- ban/lock -->
    <WIcon
      v-if="device.banned"
      icon="mdi:block-helper"
      class="absolute right-2 top-2 rounded-full text-error shadow-md"
      height="36rem"
    />
    <WIcon
      v-else-if="device.locked"
      icon="mdi:lock-outline"
      class="absolute right-2 top-2 rounded-full text-warning shadow-md"
      height="36rem"
    />

    <!-- background gradient -->
    <div
      class="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
      :class="[
        device.active
          ? 'bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400'
          : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
      ]"
    />

    <div class="relative z-10 p-5">
      <!-- de -->
      <div class="mb-4 flex items-center justify-between">
        <h3
          class="truncate text-lg text-gray-800 font-semibold dark:text-gray-100"
        >
          {{ device.deviceName }}
        </h3>

        <NTag
          size="small"
          round
          :type="device.active ? 'success' : 'default'"
        >
          {{ device.active ? $t('app.base.online') : $t('app.base.offline') }}
        </NTag>
      </div>

      <!-- core info -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <!-- CPU -->
        <div class="flex items-center gap-2">
          <WIcon icon="mdi:cpu-64-bit" class="flex-shrink-0 text-lg text-indigo-500" />
          <div>
            <div class="whitespace-nowrap text-gray-500 dark:text-gray-400">
              {{ $t('app.monitor.server.cpu.cores') }}
            </div>
            <div class="text-gray-800 font-medium dark:text-gray-100">
              {{ device.hardwareInfo?.cpuCores }}
            </div>
          </div>
        </div>

        <!-- memory -->
        <div class="flex items-center gap-2">
          <WIcon icon="mdi:memory" class="flex-shrink-0 text-lg text-indigo-500" />
          <div>
            <div class="whitespace-nowrap text-gray-500 dark:text-gray-400">
              {{ $t('app.monitor.server.mem') }}
            </div>
            <div class="text-gray-800 font-medium dark:text-gray-100">
              {{ device.hardwareInfo?.memory }} GB
            </div>
          </div>
        </div>

        <!-- network -->
        <div class="flex items-center gap-2">
          <WIcon icon="mdi:signal-4g" class="flex-shrink-0 text-lg text-indigo-500" />
          <div>
            <div class="whitespace-nowrap text-gray-500 dark:text-gray-400">
              {{ $t('app.base.netType') }}
            </div>
            <div class="text-gray-800 font-medium dark:text-gray-100">
              {{ device.deviceInfo?.netType }}
            </div>
          </div>
        </div>

        <!-- screen resolution -->
        <div class="flex items-center gap-2">
          <WIcon icon="mdi:monitor" class="flex-shrink-0 text-lg text-indigo-500" />
          <div>
            <div class="whitespace-nowrap text-gray-500 dark:text-gray-400">
              {{ $t('app.base.sr') }}
            </div>
            <div class="whitespace-nowrap whitespace-nowrap text-gray-800 font-medium dark:text-gray-100">
              {{ device.sr?.width }}×{{ device.sr?.height }}
            </div>
          </div>
        </div>
      </div>

      <!-- divider -->
      <div class="my-4 border-t border-gray-100 dark:border-gray-700" />

      <!-- location -->
      <div class="flex items-center gap-2 text-sm">
        <WIcon icon="mdi:map-marker" class="text-lg text-red-500" />
        <span class="truncate text-gray-700 dark:text-gray-300">
          {{ device.locationInfo?.country }}
          {{ device.locationInfo?.region }}
          {{ device.locationInfo?.city }}
        </span>
      </div>

      <!-- risk score -->
      <div class="mt-3 flex items-center gap-2 text-sm">
        <WIcon icon="mdi:shield-check" class="text-lg text-green-500" />
        <span class="text-gray-500 dark:text-gray-400">
          {{ $t('app.base.riskScore') }}：
        </span>
        <span class="text-green-600 font-medium dark:text-green-400">
          {{ device.riskScore }}
        </span>
      </div>
    </div>

    <!-- action bar -->
    <div
      class="relative z-10 flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-400"
    >
      <span>ID: {{ device.deviceId?.slice(-8) }}</span>
      <WAppAuthorize :value="detailButtonAuth">
        <NButton
          text
          size="tiny"
          type="primary"
          @click="$emit('detail', device._id)"
        >
          {{ $t('app.base.detail') }} →
        </NButton>
      </WAppAuthorize>
    </div>
  </NCard>
</template>
