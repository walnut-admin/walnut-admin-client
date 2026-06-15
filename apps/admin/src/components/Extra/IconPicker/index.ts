import type { InputProps } from 'naive-ui'

export { default } from './index.vue'

export interface ICompExtraIconPickerProps extends /* @vue-ignore */ InputProps {
  preset?: 'input' | 'icon'
}
