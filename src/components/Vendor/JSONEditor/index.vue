<script setup lang="ts">
import type { ICompVendorJSONEditorProps } from '.'
import JsonEditorVue from 'json-editor-vue'

defineOptions({
  name: 'WCompVendorJSONEditor',
})

const _props = defineProps<ICompVendorJSONEditorProps>()
const value = defineModel<Record<string, any>>('value')
const { loadLink } = useLinkTag('/assets/css/json-editor-dark.css')

watch(() => isDark.value, async (v) => {
  if (v) {
    await loadLink()
  }
}, { immediate: true })
</script>

<template>
  <!-- @vue-expect-error fuck mode -->
  <JsonEditorVue
    v-model="value"
    mode="tree"
    :class="{ 'jse-theme-dark': isDark }"
  />
</template>
