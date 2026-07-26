<script lang="ts" setup>
import type { MindElixirData, MindElixirInstance, Options } from 'mind-elixir'
import type { CSSProperties } from 'vue'
import { genString } from 'easy-fns-ts'
import MindElixir from 'mind-elixir'

defineOptions({
  name: 'WCompVendorMindmap',
})

const { data, options } = defineProps<{
  options: Omit<Options, 'el'>
  data: MindElixirData
  style: CSSProperties
}>()

const mindmapId = ref(`mindmap-${genString(8)}`)

const mindmapRef = shallowRef<MindElixirInstance>()

watch(
  () => isDark.value,
  (v) => {
    if (v) {
      mindmapRef.value?.changeTheme(MindElixir.DARK_THEME)
    }
    else {
      mindmapRef.value?.changeTheme(MindElixir.THEME)
    }
  },
)

onMounted(() => {
  mindmapRef.value = new MindElixir({
    el: `#${mindmapId.value}`,
    ...options,
  })
  mindmapRef.value.init(data)
})

onUnmounted(() => {
  mindmapRef.value?.destroy()
})
</script>

<template>
  <div :id="mindmapId" :style="style" />
</template>
