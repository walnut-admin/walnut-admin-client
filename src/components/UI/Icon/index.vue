<script lang="ts" setup>
import type { IconifyIconLoaderAbort } from '@iconify/vue'
import type { ICompUIIconProps } from '.'
import { Icon, iconLoaded, loadIcons } from '@iconify/vue'

defineOptions({
  name: 'WCompUIIcon',
})

const props = withDefaults(defineProps<ICompUIIconProps>(), { inline: true })
const userStorePreference = useAppStoreUserPreference()

// Variable to store function to cancel loading
const loader = ref<IconifyIconLoaderAbort>()

// Icon status
const loaded = ref<boolean>()

const getSize = computed(() => {
  // use width first, then height, default 24
  const raw = props.width ?? props.height ?? 24

  //  transform string to number
  const px
    = typeof raw === 'number'
      ? raw
      : Number.parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 24

  // transform to rem（core logic: divide by current font size）
  return `${px / userStorePreference.getFontSize}rem`
})

// Function to check if icon data is available
function check(icon: string) {
  const isLoaded = (loaded.value = iconLoaded(icon))

  // Cancel old loder
  if (loader.value) {
    loader.value()
    loader.value = undefined
  }

  if (!isLoaded) {
    loader.value = loadIcons([icon], () => {
      loaded.value = iconLoaded(icon)
    })
  }
}

watch(
  () => props.icon,
  (v) => {
    check(v as string)
  },
  { immediate: true },
)

onUnmounted(() => {
  if (loader.value)
    loader.value()
})
</script>

<template>
  <NSkeleton
    v-if="!loaded"
    :animated="false"
    circle
    :width="getSize"
    :height="getSize"
    class="inline-block"
  />
  <Icon v-else v-bind="props" :height="getSize" :width="getSize" />
</template>

<style scoped>
svg {
  outline: none !important;
}
</style>
