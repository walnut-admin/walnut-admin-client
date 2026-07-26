export { default } from './index.vue'

export interface ICompExtraPasswordProps {
  maxlength?: number
  minlength?: number
  placeholder?: string
  progress?: boolean
  capslock?: boolean
  onSubmit?: () => Promise<void>
}
