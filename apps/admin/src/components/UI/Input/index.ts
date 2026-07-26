import type { InputProps } from 'naive-ui'

export { default } from './index.vue'

// TODO 000
export interface ICompUIInputProps extends /* @vue-ignore */ InputProps {
  blackList?: string[]
  suffix?: string
  prefix?: string
  prefixClass?: string
  suffixClass?: string
  suffixIcon?: string
  prefixIcon?: string
  helpMessage?: string
  copiable?: boolean
  valueModifiers?: {
    trim?: boolean
    capitalize?: boolean
    uppercase?: boolean
  }

  // for form schema ts support
  onKeyupEnter?: (e: KeyboardEvent) => void
}
