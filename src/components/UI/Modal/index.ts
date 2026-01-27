import type { ModalProps } from 'naive-ui'

export { default } from './index.vue'

// TODO 000
export interface ICompUIModalProps extends /* @vue-ignore */ Omit<ModalProps, 'segmented'> {
  show?: boolean
  loading?: boolean
  title?: string
  helpMessage?: string
  width?: string
  height?: string
  fullscreen?: boolean
  defaultButton?: boolean
  segmented?: boolean
  beforeClose?: () => Promise<boolean>
}
