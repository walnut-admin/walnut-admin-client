<script lang="ts" setup>
import type { ICompExtraQRCodeProps } from '.'

defineOptions({
  name: 'WCompExtraQRCode',
})

const { expireSeconds, size = 100, padding = 12 } = defineProps<ICompExtraQRCodeProps>()

const emits = defineEmits<{ refresh: [callback: Fn] }>()

const count = ref(0)

const { pause, isActive, resume } = useIntervalFn(
  () => {
    count.value++

    if (count.value > expireSeconds!) {
      count.value = 0
      pause()
    }
  },
  1000,
  {
    immediateCallback: expireSeconds !== undefined,
  },
)

function onRefresh() {
  emits('refresh', resume)
}
</script>

<template>
  <div class="relative" :style="{ height: `${size + padding * 2}px`, width: `${size + padding * 2}px` }">
    <n-qr-code
      :value="url"
      alt="QR Code"
      class="transition transition-all"
      :class="[
        { 'blur-sm brightness-80 contrast-50': !isActive || success },
      ]"
      :size="size"
      :padding="padding"
      :style="{ height: `${size + padding * 2}px`, width: `${size + padding * 2}px` }"
    />

    <WTransition appear>
      <div class="abs-center">
        <template v-if="!isActive">
          <div class="mb-2 whitespace-nowrap text-gray-200 font-bold">
            {{ $t('comp.qrcode.expired') }}
          </div>

          <n-button size="tiny" type="info" round @click="onRefresh">
            {{ $t('comp.qrcode.refresh') }}
          </n-button>
        </template>

        <n-result
          v-if="success"
          size="small"
          status="success"
          :description="$t('app.base.success')"
          class="text-gray-100"
        />
      </div>
    </WTransition>
  </div>
</template>
