import type hljsType from 'highlight.js'
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'
import { loadHighlightCss } from '../utils/highlight-theme'

// ── Module-level — for non-component usage (format.ts, etc.) ──

let hljsModule: typeof hljsType | null = null
let loadPromise: Promise<void> | null = null

export function getHljs() {
  return hljsModule
}

export function ensureHljs() {
  if (!loadPromise) {
    loadPromise = import('highlight.js').then((m) => {
      hljsModule = m.default as typeof hljsType
      loadHighlightCss()
    })
  }
  return loadPromise
}

// ── Composable — for component reactive state (CodeBlock.vue) ──

export const useHighlight = createGlobalState(() => {
  const ready = ref(false)
  const loading = ref(false)

  async function ensure() {
    if (ready.value)
      return
    loading.value = true
    await ensureHljs()
    ready.value = true
    loading.value = false
  }

  function highlight(code: string, lang?: string): string {
    if (!hljsModule)
      return ''
    if (lang && hljsModule.getLanguage(lang)) {
      try {
        return hljsModule.highlight(code, { language: lang }).value
      }
      catch {
        return hljsModule.highlightAuto(code).value
      }
    }
    return hljsModule.highlightAuto(code).value
  }

  return { ready, loading, ensure, highlight }
})
