import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(() => import('./index.vue'))

export interface ICompVendorCodeMirrorProps {
  value: string
  placeholder?: string
  disabled?: boolean
  height?: string
  autofocus?: boolean
}
