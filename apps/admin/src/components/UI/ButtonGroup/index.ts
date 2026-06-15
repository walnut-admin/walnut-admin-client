import type { ButtonGroupProps } from 'naive-ui'
import type { ICompUIButtonProps } from '../Button'

export { default } from './index.vue'

// TODO 000
export interface ICompUIButtonGroupProps extends /* @vue-ignore */ ButtonGroupProps {
  groups: ICompUIButtonProps[]
}
