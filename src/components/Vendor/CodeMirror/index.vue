<script lang="ts" setup>
import type { EditorView, ViewUpdate } from '@codemirror/view'

import type { Recordable } from 'easy-fns-ts'
import type { ICompVendorCodeMirrorProps } from '.'
import { redo, undo } from '@codemirror/commands'
import { closeSearchPanel, openSearchPanel } from '@codemirror/search'

import { oneDark } from '@codemirror/theme-one-dark'
// TODO not update any more, move the code to this folder
// https://github.com/surmon-china/vue-codemirror/blob/main/src/codemirror.ts
import { Codemirror } from 'vue-codemirror'
import { languages } from './language'

defineOptions({
  name: 'WCompVendorCodeMirror',
})

withDefaults(defineProps<ICompVendorCodeMirrorProps>(), {
  placeholder: 'Code goes here...',
  height: '300px',
  autofocus: false,
})

const emits = defineEmits<{ blur: [e: ViewUpdate], focus: [e: ViewUpdate] }>()

const value = defineModel<string>('value')

const { t } = useAppI18n()

const infos = ref<{
  selected: number
  cursor: number
  length: number
  lines: number
}>({
  selected: 0,
  cursor: 0,
  length: 0,
  lines: 0,
})

const searchPanelOpen = ref(false)
const phrases = ref()

const appStoreLocale = useAppStoreLocale()

watch(
  () => appStoreLocale.locale,
  async (v) => {
    const modules = import.meta.glob(
      '/vendor/codeMirror/langs/zh-CN.js',
    )

    for (const path in modules) {
      const res = (await modules[path]()) as { default: Recordable }

      if (v === AppConstLocale.ZH_CN)
        phrases.value = res.default
      else
        phrases.value = {}
    }
  },
  {
    immediate: true,
  },
)

const extensions = computed(() =>
  isDark.value ? [...languages, oneDark] : languages,
)

// @codemirror/view
const view = shallowRef<EditorView>()

function onReady(payload: any) {
  view.value = payload.view
}

function onChange(v: string, _e: ViewUpdate) {
  value.value = v
}

function onFocus(e: ViewUpdate) {
  emits('focus', e)
}

function onBlur(e: ViewUpdate) {
  emits('blur', e)
}

function onUpdate(e: ViewUpdate) {
  const ranges = e.state.selection.ranges

  infos.value!.selected = ranges.reduce(
    (plus, range) => plus + range.to - range.from,
    0,
  )
  infos.value!.cursor = ranges[0].anchor
  infos.value!.length = e.state.doc.length
  infos.value!.lines = e.state.doc.lines
}

function onUndo() {
  undo({
    state: view.value!.state,
    dispatch: view.value!.dispatch,
  })
}

function onRedo() {
  redo({
    state: view.value!.state,
    dispatch: view.value!.dispatch,
  })
}

function onSearch() {
  if (!searchPanelOpen.value)
    openSearchPanel(view.value!)
  else
    closeSearchPanel(view.value!)

  searchPanelOpen.value = !searchPanelOpen.value
}
</script>

<template>
  <div class="relative">
    <Codemirror
      :model-value="value"
      :placeholder="placeholder"
      :style="{ height }"
      :autofocus="autofocus"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      :disabled="disabled"
      :phrases="phrases"
      @ready="onReady"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @update="onUpdate"
    />

    <div class="h-8 w-full hstack justify-between bg-bodyColor px-2 text-xs">
      <div class="hstack items-center justify-end gap-4">
        <n-button text size="small" class="text-xs" @click="onUndo">
          {{ t('app.base.undo') }}
        </n-button>
        <n-button text size="small" class="text-xs" @click="onRedo">
          {{ t('app.base.redo') }}
        </n-button>
        <n-button text size="small" class="text-xs" @click="onSearch">
          {{ t('app.base.search') }}
        </n-button>
      </div>

      <div class="hstack items-center justify-end gap-4">
        <div>{{ t('app.base.length') }}: {{ infos.length }}</div>
        <div>{{ t('app.base.lines') }}: {{ infos.lines }}</div>
        <div>{{ t('app.base.cursor') }}: {{ infos.cursor }}</div>
        <div>{{ t('app.base.selected') }}: {{ infos.selected }}</div>
      </div>
    </div>
  </div>
</template>
