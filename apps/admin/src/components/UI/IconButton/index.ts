import type { PopconfirmProps, TooltipProps } from 'naive-ui'
import type { AllowedComponentProps } from 'vue'
import type { ICompUIButtonProps } from '../Button'
import type { ICompUIIconProps } from '../Icon'

export { default } from './index.vue'

export interface ICompUIIconButtonProps extends AllowedComponentProps {
  iconProps?: ICompUIIconProps
  buttonProps?: ICompUIButtonProps & AllowedComponentProps
  tooltip?: boolean
  tooltipMsg?: string | string[]
  tooltipProps?: TooltipProps
  confirm?: boolean
  confirmMsg?: string
  popConfirmProps?: PopconfirmProps
}
