<script setup lang="ts">
import { useMagicKeys, whenever } from '@vueuse/core'
import { computed, ref } from 'vue'
import AnimatedPlaceholder from '@/components/Global/AI/components/ui/AnimatedPlaceholder.vue'
import { useSpeechRecognition } from '@/components/Global/AI/composables/useSpeechRecognition'
import { useAIPreferences } from '@/components/Global/AI/store/useAIPreferences'
import { useChatInput } from '@/components/Global/AI/store/useChatInput'
import { useChatSend } from '@/components/Global/AI/store/useChatSend'
import { useConversationStore } from '@/components/Global/AI/store/useConversationStore'
import { useInputHistory } from '@/components/Global/AI/store/useInputHistory'
import { useStreamManager } from '@/components/Global/AI/store/useStreamManager'

defineOptions({ name: 'ChatInput' })

const { inputText, canSend, isFocused, inputRef } = useChatInput()
const aiPrefs = useAIPreferences()
const { currentId } = useConversationStore()
const { isLoading, abortStreaming } = useStreamManager()
const { handleSend: doSend } = useChatSend()
const { commitToHistory, handleKeydown } = useInputHistory()

const {
  isSupported,
  isListening,
  micTitle,
  startMic,
  stopMic,
  cancelMic,
  resetMic,
} = useSpeechRecognition()

function handleStop() {
  abortStreaming(currentId.value)
}

function handleSend() {
  const text = inputText.value.trim()
  if (text)
    commitToHistory(text)
  resetMic()
  doSend()
}

// ── Ctrl+Shift+K toggle mic ──
const { ctrl, shift, k } = useMagicKeys()

whenever(computed(() => ctrl.value && shift.value && k.value), () => {
  if (isLoading.value)
    return
  if (isListening.value) {
    const voiceText = stopMic()
    if (voiceText)
      handleSend()
  }
  else {
    startMic()
  }
})

const micBtnRef = ref<HTMLButtonElement>()
const isPointerOverMic = ref(false)

function onMicPress(e: PointerEvent) {
  micBtnRef.value?.setPointerCapture(e.pointerId)
  isPointerOverMic.value = true
  startMic()
}

function onMicRelease() {
  if (!isListening.value)
    return
  if (isPointerOverMic.value) {
    const voiceText = stopMic()
    if (voiceText)
      handleSend()
  }
  else {
    cancelMic()
  }
}

function onMicMove(e: PointerEvent) {
  if (!micBtnRef.value)
    return
  const rect = micBtnRef.value.getBoundingClientRect()
  isPointerOverMic.value
    = e.clientX >= rect.left && e.clientX <= rect.right
      && e.clientY >= rect.top && e.clientY <= rect.bottom
}

const micBtnClass = computed(() => {
  if (!isListening.value)
    return 'ai-gradient-primary'
  if (!isPointerOverMic.value)
    return 'bg-gray-500 hover:bg-gray-600'
  return 'bg-red-500 hover:bg-red-600 animate-pulse'
})

const micIcon = computed(() => {
  if (isListening.value && !isPointerOverMic.value)
    return 'carbon:close'
  return 'carbon:microphone'
})

defineExpose({ resetMic })
</script>

<template>
  <div class="input-area border-border bg-fill-light shrink-0 border-t p-3">
    <div class="input-wrapper border-border bg-fill flex items-stretch gap-2 border rounded-2.5 p-2 px-3 transition-colors duration-150 focus-within:border-primary">
      <button
        class="think-toggle bg-fill shrink-0 cursor-pointer self-center border rounded-md px-2 py-1 text-11px transition-all duration-150 disabled:cursor-not-allowed"
        :class="aiPrefs.deepThinking ? 'border-primary bg-primary-lightest text-primary !bg-primary-lighter' : 'border-border text-text-placeholder hover:border-border-light hover:text-text-regular'"
        :disabled="isLoading"
        title="深度思考"
        @click="aiPrefs.deepThinking = !aiPrefs.deepThinking"
      >
        <span class="flex items-center gap-1 whitespace-nowrap">
          <span class="text-sm">🧠</span>
        </span>
      </button>
      <div class="relative flex flex-1 items-center">
        <textarea
          ref="inputRef"
          v-model="inputText"
          class="text-text-primary max-h-64px w-full resize-none border-none bg-transparent text-13px leading-relaxed outline-none field-sizing-content disabled:opacity-60"
          rows="1"
          :disabled="isLoading"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keydown="handleKeydown"
        />
        <AnimatedPlaceholder :active="!inputText && !isFocused" />
      </div>
      <div v-if="isSupported" class="mic-wrapper flex-center relative shrink-0">
        <div
          v-if="isListening && !isPointerOverMic"
          class="cancel-hint absolute bottom-full mb-2 whitespace-nowrap rounded-full bg-gray-700 px-3 py-1 text-11px text-white shadow-lg transition-opacity duration-150"
        >
          松手取消发送
        </div>
        <button
          ref="micBtnRef"
          class="mic-btn flex-center h-8 w-8 shrink-0 cursor-pointer select-none rounded-full border-none text-white transition-all duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-md"
          :class="micBtnClass"
          :disabled="isLoading"
          :title="micTitle"
          @pointerdown.prevent="onMicPress"
          @pointerup="onMicRelease"
          @pointermove="onMicMove"
        >
          <WIcon :icon="micIcon" width="16" />
        </button>
      </div>
      <button
        class="send-btn flex-center h-8 w-8 shrink-0 cursor-pointer self-center rounded-full border-none text-white transition-all duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-md"
        :class="isLoading ? 'bg-red-500 hover:bg-red-600' : 'ai-gradient-primary'"
        :disabled="!isLoading && !canSend"
        :title="isLoading ? '停止生成' : '发送'"
        @click="isLoading ? handleStop() : handleSend()"
      >
        <WIcon :icon="isLoading ? 'carbon:stop' : 'carbon:send-alt'" width="16" />
      </button>
    </div>
    <p class="input-hint text-text-placeholder mt-1.5 text-center text-10px">
      AI 助手仅供参考，请以实际数据为准
    </p>
  </div>
</template>
