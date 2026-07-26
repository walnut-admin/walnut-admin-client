import type { PopconfirmProps } from 'naive-ui'
import type { ICompUIButtonProps } from '../Button'

export { default } from './index.vue'

// TODO 000
export interface ICompUIButtonConfirmProps extends /* @vue-ignore */ PopconfirmProps {
  confirmMsg?: string
  buttonProps?: ICompUIButtonProps
  onConfirm?: Fn
}
