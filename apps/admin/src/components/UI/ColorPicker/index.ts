import type { ColorPickerProps } from 'naive-ui'

export { default } from './index.vue'

// TODO 000
export interface ICompUIColorPickerProps extends /* @vue-ignore */ ColorPickerProps {
  eyeDropper?: boolean
}
