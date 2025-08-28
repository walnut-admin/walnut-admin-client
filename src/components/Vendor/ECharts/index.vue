<script lang="ts" setup>
import type { ICompVendorEChartsProps } from '.'
import { genString } from 'easy-fns-ts'

defineOptions({
  name: 'WCompVendorECharts',
})

const props = withDefaults(defineProps<ICompVendorEChartsProps>(), {
  height: '400px',
  width: '100%',
})

const chartId = ref(`echarts-${genString(8)}`)
// third party libs should use shallowRef !!!
const chartInst = shallowRef<echarts.ECharts>()

const appStoreLocale = useAppStoreLocale()
const appStoreSettings = useAppStoreSetting()

const getSkinName = computed(() => (isDark.value ? 'dark' : undefined))

const getLangName = computed(() =>
  appStoreLocale.getLocale.split('_')[0].toUpperCase(),
)

useEventListener('resize', () => {
  chartInst.value?.resize()
})

function onDispose() {
  if (chartInst.value) {
    chartInst.value.dispose()
    chartInst.value = undefined
  }
}

function onInit() {
  onDispose()

  const target = document.getElementById(chartId.value)!

  if (!target)
    return

  // if ondemand usage, just uncomment top echarts import, and change below to `echarts.init`
  const chart = window.echarts.init(target, getSkinName.value, {
    locale: getLangName.value,
  })

  chartInst.value = chart

  chartInst.value!.setOption(
    isDark.value
      ? Object.assign(props.option, {
          backgroundColor: 'transparent',
          animation: !appStoreSettings.app.reducedMotion,
        })
      : Object.assign(props.option, {
          animation: !appStoreSettings.app.reducedMotion,
        }),
  )
}

watch(() => [getSkinName, getLangName, props.option], onInit, {
  deep: true,
  flush: 'post',
})

tryOnMounted(onInit)

tryOnUnmounted(onDispose)

onActivated(onInit)

onDeactivated(onDispose)
</script>

<template>
  <div :id="chartId" :style="{ width, height }" />
</template>
