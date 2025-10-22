<script lang="ts" setup>
import type { IModels } from '@/api/models'

defineOptions({
  name: 'DeviceCard',
})

const _props = defineProps<{ device: IModels.SystemDevice }>()

const _emits = defineEmits<{ detail: [id?: string] }>()
</script>

<template>
  <NCard
    :bordered="false"
    size="medium"
    class="group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 dark:bg-neutral-900 hover:shadow-lg"
  >
    <!--  背景渐变装饰 -->
    <div
      class="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
      :class="[
        device.active
          ? 'bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400'
          : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
      ]"
    />

    <div class="relative z-10 p-5">
      <!-- 标题行 -->
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
          {{ device.active ? '在线' : '离线' }}
        </NTag>
      </div>

      <!-- 核心信息 -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <!-- CPU -->
        <div class="flex items-center gap-2">
          <WIcon icon="mdi:cpu-64-bit" class="text-lg text-indigo-500" />
          <div>
            <div class="text-gray-500 dark:text-gray-400">
              CPU 核心
            </div>
            <div class="text-gray-800 font-medium dark:text-gray-100">
              {{ device.hardwareInfo?.cpuCores }}
            </div>
          </div>
        </div>

        <!-- 内存 -->
        <div class="flex items-center gap-2">
          <WIcon icon="mdi:memory" class="text-lg text-indigo-500" />
          <div>
            <div class="text-gray-500 dark:text-gray-400">
              内存
            </div>
            <div class="text-gray-800 font-medium dark:text-gray-100">
              {{ device.hardwareInfo?.memory }} GB
            </div>
          </div>
        </div>

        <!-- 网络 -->
        <div class="flex items-center gap-2">
          <WIcon icon="mdi:signal-4g" class="text-lg text-indigo-500" />
          <div>
            <div class="text-gray-500 dark:text-gray-400">
              网络
            </div>
            <div class="text-gray-800 font-medium dark:text-gray-100">
              {{ device.deviceInfo?.netType }}
            </div>
          </div>
        </div>

        <!-- 分辨率 -->
        <div class="flex items-center gap-2">
          <WIcon icon="mdi:monitor" class="text-lg text-indigo-500" />
          <div>
            <div class="text-gray-500 dark:text-gray-400">
              分辨率
            </div>
            <div class="text-gray-800 font-medium dark:text-gray-100">
              {{ device.sr?.width }}×{{ device.sr?.height }}
            </div>
          </div>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="my-4 border-t border-gray-100 dark:border-gray-700" />

      <!-- 地理位置 -->
      <div class="flex items-center gap-2 text-sm">
        <WIcon icon="mdi:map-marker" class="text-lg text-red-500" />
        <span class="text-gray-700 dark:text-gray-300">
          {{ device.locationInfo?.country }}
          {{ device.locationInfo?.region }}
          {{ device.locationInfo?.city }}
        </span>
      </div>

      <!-- 风险评分 -->
      <div class="mt-3 flex items-center gap-2 text-sm">
        <WIcon icon="mdi:shield-check" class="text-lg text-green-500" />
        <span class="text-gray-500 dark:text-gray-400">风险评分：</span>
        <span class="text-green-600 font-medium dark:text-green-400">
          {{ device.riskScore }}
        </span>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div
      class="relative z-10 flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-400"
    >
      <span>ID: {{ device.deviceId?.slice(-8) }}</span>
      <NButton
        text
        size="tiny"
        quaternary
        type="primary"
        @click="$emit('detail', device.deviceId)"
      >
        查看详情 →
      </NButton>
    </div>
  </NCard>
</template>
