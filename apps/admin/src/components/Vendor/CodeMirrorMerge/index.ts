import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(() => import('./index.vue'))

export interface ICompVendorCodeMirrorMergeProps {
  before: string | Record<string, any>
  after: string | Record<string, any>
  height?: number
  readOnly?: boolean
  showRevertControls?: boolean
}
