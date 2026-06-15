<script lang="ts" setup>
defineOptions({
  name: 'WIFrame',
  inheritAttrs: false,
})

defineProps<{ frameSrc?: string }>()

const show = ref(false)

const end = () => (show.value = false)

onMounted(() => {
  show.value = true
})
</script>

<template>
  <div class="h-full w-full">
    <n-spin class="h-full w-full" :show="show">
      <iframe
        :src="frameSrc ?? $route.meta.url"
        class="h-full w-full"
        frameborder="0"
        @load="end"
      />
    </n-spin>
  </div>
</template>

<style lang="scss" scoped>
:deep(.w-spin-content) {
  height: 100%;
}
</style>
