import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(() => import('./index.vue'))

export interface ICompVendorTinymceProps {
  disabled?: boolean
  height?: string
  width?: string
}
