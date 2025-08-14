import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export * from './types'

export default createAsyncComponent(() => import('./index.vue'))
