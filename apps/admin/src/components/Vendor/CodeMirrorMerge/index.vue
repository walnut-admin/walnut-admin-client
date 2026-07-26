<script lang="ts" setup>
import type { DirectMergeConfig } from '@codemirror/merge'
import type { ICompVendorCodeMirrorMergeProps } from '.'
import { json } from '@codemirror/lang-json'
import { MergeView } from '@codemirror/merge'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup, EditorView } from 'codemirror'

const props = withDefaults(defineProps<ICompVendorCodeMirrorMergeProps>(), {
  height: 400,
  readOnly: true,
  showRevertControls: false,
})

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
let mergeView: MergeView | null = null

const getConfig = computed((): DirectMergeConfig => {
  const basicExtensions = [
    basicSetup,
    json(),
    EditorState.readOnly.of(props.readOnly),
  ]

  if (isDark.value) {
    basicExtensions.push(oneDark)
  }

  return {
    a: {
      doc: toJSONString(props.before),
      extensions: [
        ...basicExtensions,
      ],
    },
    b: {
      doc: toJSONString(props.after),
      extensions: [
        ...basicExtensions,
        EditorView.editable.of(!props.readOnly),
      ],
    },
    parent: containerRef.value!,
    revertControls: props.showRevertControls ? 'a-to-b' : undefined,
    highlightChanges: true,
    collapseUnchanged: { margin: 3, minSize: 8 },
  }
})

function toJSONString(value: string | Record<string, any>) {
  if (typeof value === 'string')
    return value
  try {
    return JSON.stringify(value, null, 2)
  }
  catch {
    return '{}'
  }
}

function createView() {
  if (!containerRef.value)
    return
  if (mergeView) {
    mergeView.destroy()
    mergeView = null
  }

  mergeView = new MergeView(getConfig.value)
}

onMounted(() => {
  createView()
})

watch(
  () => [props.before, props.after, props.readOnly, props.showRevertControls],
  () => {
    createView()
  },
)

onBeforeUnmount(() => {
  mergeView?.destroy()
  mergeView = null
})
</script>

<template>
  <div
    ref="containerRef"
    class=""
    :style="{ height: `${height}px` }"
  />
</template>
