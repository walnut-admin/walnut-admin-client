import { NOTIFICATION_SOUND_URL } from '../config/constants'

let audio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement | null {
  if (!NOTIFICATION_SOUND_URL)
    return null

  if (!audio) {
    audio = new Audio(NOTIFICATION_SOUND_URL)
    audio.volume = 0.5
  }
  return audio
}

export function playNotificationSound(): void {
  const el = getAudio()
  if (!el)
    return

  el.currentTime = 0
  el.play().catch(() => {
    // 静默忽略 autoplay 策略拦截等错误
  })
}
