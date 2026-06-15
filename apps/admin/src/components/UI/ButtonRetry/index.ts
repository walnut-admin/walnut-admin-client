import type { ICompUIButtonProps } from '../Button'

export { default } from './index.vue'

// TODO 000
export interface ICompUIButtonRetryProps extends /* @vue-ignore */ ICompUIButtonProps {
  retryKey?: string
  retrySeconds?: number
  onRetryClick?: (startCountdown: Fn) => void
}
