import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(() => import('./index.vue'))

export interface WAppFullScreenProps {
  isFullscreen: boolean
  clickEvent: Fn
  size?: string
}
