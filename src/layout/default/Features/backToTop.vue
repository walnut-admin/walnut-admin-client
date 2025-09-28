<script lang="ts" setup>
defineOptions({
  name: 'TheAppBackToTop',
})

const { currentRoute } = useAppRouter()

const showBackToTop = ref(true)

watch(
  () => currentRoute.value.name,
  () => {
    showBackToTop.value = false
    const id = setTimeout(() => {
      showBackToTop.value = true
      clearTimeout(id)
    }, 1000)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <n-back-top
    v-if=" showBackToTop"
    :listen-to="`#${String($route.name)}`"
    :bottom="80"
    :right="40"
  />
</template>
