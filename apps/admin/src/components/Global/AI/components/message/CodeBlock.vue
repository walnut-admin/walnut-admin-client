<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, shallowRef, useTemplateRef } from 'vue'
import { useHighlight } from '@/components/Global/AI/store/useHighlight'
import { highlightCache } from '@/components/Global/AI/utils/highlightCache'

defineOptions({ name: 'CodeBlock' })

const props = withDefaults(defineProps<{
  language?: string
  code: string
  skipHighlight?: boolean
}>(), {
  language: '',
})

const { copy, copied } = useClipboard({ legacy: true })
const { ready: hljsReady, loading: hljsLoading, ensure: ensureHljs, highlight: doHighlight } = useHighlight()

const langLabel = computed(() => props.language || 'code')

const codeBlockRef = useTemplateRef<HTMLElement>('codeBlockRef')
const headerRef = useTemplateRef<HTMLElement>('headerRef')
const scrollContainerRef = shallowRef<HTMLElement>()
const floatingBtnVisible = ref(false)
const floatingBtnTop = ref(0)
const floatingBtnRight = ref(0)
let rafId: ReturnType<typeof requestAnimationFrame> | null = null

const highlightedHtml = computed(() => {
  if (props.skipHighlight)
    return ''

  if (!hljsReady.value)
    return ''

  const cacheKey = `${props.language}:${props.code}`
  const cached = highlightCache.get(cacheKey)
  if (cached !== undefined)
    return cached

  const result = doHighlight(props.code, props.language)
  highlightCache.set(cacheKey, result)
  return result
})

function copyCode() {
  copy(props.code)
}

function updateFloatingButtonPosition() {
  const container = scrollContainerRef.value
  const block = codeBlockRef.value
  const header = headerRef.value
  if (!container || !block || !header) {
    floatingBtnVisible.value = false
    return
  }

  const containerRect = container.getBoundingClientRect()
  const blockRect = block.getBoundingClientRect()
  const headerRect = header.getBoundingClientRect()

  if (blockRect.bottom < containerRect.top || blockRect.top > containerRect.bottom) {
    floatingBtnVisible.value = false
    return
  }

  if (headerRect.bottom > containerRect.top) {
    floatingBtnVisible.value = false
    return
  }

  const stickyEl = container.querySelector(':scope > .sticky') as HTMLElement | null
  let stickyOffset = 0
  if (stickyEl) {
    const stickyRect = stickyEl.getBoundingClientRect()
    if (stickyRect.bottom > containerRect.top)
      stickyOffset = stickyRect.height
  }

  floatingBtnTop.value = Math.max(0, containerRect.top - blockRect.top) + 4 + stickyOffset
  floatingBtnRight.value = 8
  floatingBtnVisible.value = true
}

function onScrollHandler() {
  if (rafId !== null)
    return
  rafId = requestAnimationFrame(() => {
    rafId = null
    updateFloatingButtonPosition()
  })
}

onMounted(() => {
  if (!props.skipHighlight) {
    ensureHljs()
  }
  const el = codeBlockRef.value
  if (!el)
    return
  const container = el.closest('.messages-container') as HTMLElement | null
  if (!container)
    return
  scrollContainerRef.value = container
  container.addEventListener('scroll', onScrollHandler, { passive: true })
})

onUnmounted(() => {
  if (rafId !== null)
    cancelAnimationFrame(rafId)
  scrollContainerRef.value?.removeEventListener('scroll', onScrollHandler)
})
</script>

<template>
  <div ref="codeBlockRef" class="code-block border-border bg-bg-page relative my-2 border rounded-xl border-solid">
    <div
      ref="headerRef"
      class="code-block-header border-border bg-fill sticky top-0 z-1 flex items-center justify-between border-b rounded-t-xl border-solid px-4 py-2"
    >
      <span class="text-text-regular text-12px font-mono">{{ langLabel }}</span>
      <div class="flex items-center gap-2">
        <WIcon v-if="hljsLoading" icon="carbon:circle-dash" width="12" class="text-text-placeholder animate-spin" />
        <button
          class="flex cursor-pointer items-center gap-1 border-none bg-transparent text-12px transition-colors"
          :class="copied ? 'text-primary' : 'text-text-regular'" @click="copyCode"
        >
          <WIcon v-if="copied" icon="carbon:checkmark" width="12" />
          <WIcon v-else icon="carbon:copy" width="12" />
          <span>{{ copied ? '已复制' : '复制' }}</span>
        </button>
      </div>
    </div>
    <pre class="code-block-body bg-bg-page! overflow-x-auto px-4 py-3 text-13px leading-relaxed m-0!">
      <code v-if="skipHighlight" class="text-text-primary">{{ code }}</code>
      <code v-else-if="hljsLoading" class="text-text-placeholder">{{ code }}</code>
      <code v-else class="hljs" v-html="highlightedHtml" />
    </pre>
    <button
      v-if="floatingBtnVisible"
      class="border-border bg-bg-overlay shadow-panel absolute z-10 h-7 w-7 flex cursor-pointer items-center justify-center border rounded-md border-solid p-0 backdrop-blur-2 transition-colors duration-150"
      :class="copied ? 'text-primary' : 'text-text-regular hover:bg-fill hover:text-text-primary'" :style="{
        top: `${floatingBtnTop}px`,
        right: `${floatingBtnRight}px`,
      }" @click="copyCode"
    >
      <WIcon v-if="copied" icon="carbon:checkmark" width="14" />
      <WIcon v-else icon="carbon:copy" width="14" />
    </button>
  </div>
</template>
