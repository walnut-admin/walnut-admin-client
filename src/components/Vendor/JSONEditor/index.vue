<script setup lang="ts">
import type { ICompVendorJSONEditorProps } from '.'
import JsonEditorVue from 'json-editor-vue'

defineOptions({
  name: 'WCompVendorJSONEditor',
})

const { button = false, modalTitle } = defineProps<ICompVendorJSONEditorProps>()
const value = defineModel<Record<string, any>>('value')

const { loadLink } = useLinkTag('/assets/css/json-editor-dark.css')
const [DefineJSONEditor, ReuseJSONEditor] = createReusableTemplate()

const showModal = ref(false)

watch(() => isDark.value, async (v) => {
  if (v) {
    await loadLink()
  }
}, { immediate: true })
</script>

<template>
  <div>
    <DefineJSONEditor>
      <!-- @vue-expect-error mode -->
      <JsonEditorVue
        v-model="value"
        mode="tree"
        :class="{ 'jse-theme-dark': isDark }"
        v-bind="$attrs"
      />
    </DefineJSONEditor>

    <template v-if="button">
      <WButton type="primary" @click="showModal = true">
        {{ $t('app.base.checkOrEdit') }}
      </WButton>

      <WModal
        v-model:show="showModal"
        width="60%"
        :title="modalTitle"
        :close-on-esc="false"
        :closable="false"
        :mask-closable="false"
        :fullscreen="false"
        @yes="showModal = false"
      >
        <ReuseJSONEditor />
      </WModal>
    </template>

    <ReuseJSONEditor v-else />
  </div>
</template>
