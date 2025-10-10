import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(() => import('./index.vue'))

export interface WCropperInst {
  onRefresh: () => void
  onGetCropperBlob: () => Promise<Blob>
}

export interface ICompVendorCropperProps {
  alt?: string
  disabled?: boolean
  center?: boolean
}
