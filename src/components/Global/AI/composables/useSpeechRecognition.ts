import { useSpeechRecognition as useVueUseSpeechRecognition } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import { computed, onUnmounted, ref, watch, watchEffect } from 'vue'
import { SPEECH_LANG, SPEECH_MAX_ALTERNATIVES } from '../config/constants'
import { useChatInput } from '../store/useChatInput'
import { useStreamManager } from '../store/useStreamManager'

export function useSpeechRecognition() {
  const { inputText } = useChatInput()
  const { isLoading } = useStreamManager()
  const message = useMessage()

  const isSecureContext = !!window.isSecureContext

  const {
    isSupported: vueUseIsSupported,
    isListening,
    isFinal,
    result,
    error,
    start: vueUseStart,
    stop: vueUseStop,
  } = useVueUseSpeechRecognition({
    lang: SPEECH_LANG,
    continuous: true,
    interimResults: true,
    maxAlternatives: SPEECH_MAX_ALTERNATIVES,
  })

  const isSupported = computed(() => vueUseIsSupported.value && isSecureContext)

  // -- Voice session state --
  const voiceAccumulated = ref('')
  const voiceInterim = ref('')
  const isVoiceSessionActive = ref(false)
  const textBeforeVoice = ref('')

  /**
   * WHAT: Concatenates voice recognition results (interim + final) into the chat input field in real time
   *
   * Use case: Voice input session — interim results preview, final results accumulate until user releases mic
   * Side effect: Mutates inputText.value on every tracked reactive change; reads voiceAccumulated/voiceInterim
   */
  watchEffect(() => {
    if (!isVoiceSessionActive.value)
      return

    const transcript = result.value
    if (!transcript)
      return

    if (isFinal.value) {
      voiceAccumulated.value += transcript
      voiceInterim.value = ''
    }
    else {
      voiceInterim.value = transcript
    }

    const parts: string[] = []
    if (textBeforeVoice.value)
      parts.push(textBeforeVoice.value)
    if (voiceAccumulated.value)
      parts.push(voiceAccumulated.value)
    if (voiceInterim.value)
      parts.push(voiceInterim.value)
    inputText.value = parts.join(' ')
  })

  // -- Error -> Toast --
  const errorMessage = ref('')
  /**
   * WHAT: Maps browser SpeechRecognition error codes to user-friendly Chinese error toasts
   *
   * Use case: Voice input failure — show actionable error message to user
   * Side effect: Calls message.error() which displays an error toast popup
   */
  watch(error, (err) => {
    if (!err) {
      errorMessage.value = ''
      return
    }
    const code = (err as SpeechRecognitionErrorEvent).error || ''

    const map: Record<string, string> = {
      'not-allowed': '未授权麦克风权限',
      'no-speech': '未检测到语音',
      'audio-capture': '无法访问麦克风',
      'network': '网络错误，语音识别不可用',
      'aborted': isSecureContext
        ? '语音识别已中止（请检查麦克风权限或网络）'
        : '语音识别已中止（需 HTTPS 或 localhost 访问）',
      'language-not-supported': '不支持该语言',
      'service-not-allowed': '语音服务被禁止',
    }
    errorMessage.value = map[code] || `语音识别出错: ${code}`

    if (errorMessage.value)
      message.error(errorMessage.value)
  })

  // -- Core operations --
  /** Start microphone and begin speech recognition */
  function startMic() {
    if (isLoading.value || isVoiceSessionActive.value)
      return
    textBeforeVoice.value = inputText.value
    voiceAccumulated.value = ''
    voiceInterim.value = ''
    // Clear stale recognition data to prevent watchEffect from picking up old results
    result.value = ''
    isFinal.value = false
    isVoiceSessionActive.value = true
    vueUseStart()
  }

  /** Stop microphone, concatenate accumulated voice text, and return it */
  function stopMic(): string {
    if (!isVoiceSessionActive.value)
      return ''
    isVoiceSessionActive.value = false

    const parts: string[] = []
    if (voiceAccumulated.value)
      parts.push(voiceAccumulated.value)
    if (voiceInterim.value)
      parts.push(voiceInterim.value)
    const voiceText = parts.join(' ')

    vueUseStop()

    if (voiceText) {
      inputText.value = (textBeforeVoice.value ? `${textBeforeVoice.value} ` : '') + voiceText
    }

    return voiceText
  }

  /** Cancel voice input and restore the text that was in the input before starting */
  function cancelMic() {
    if (!isVoiceSessionActive.value)
      return
    isVoiceSessionActive.value = false
    vueUseStop()
    inputText.value = textBeforeVoice.value
    voiceAccumulated.value = ''
    voiceInterim.value = ''
    textBeforeVoice.value = ''
  }

  /** Reset all voice state without affecting the input field */
  function resetMic() {
    if (isVoiceSessionActive.value) {
      isVoiceSessionActive.value = false
      vueUseStop()
    }
    voiceAccumulated.value = ''
    voiceInterim.value = ''
    textBeforeVoice.value = ''
  }

  // -- Computed --
  const micTitle = computed(() => {
    if (!isSupported.value)
      return '当前浏览器不支持语音识别'
    if (isListening.value)
      return '松手发送，滑出取消'
    return '按住说话，松手发送（Ctrl+Shift+K 切换）'
  })

  onUnmounted(() => {
    vueUseStop()
  })

  return {
    isSupported,
    isListening,
    micTitle,
    startMic,
    stopMic,
    cancelMic,
    resetMic,
  }
}
