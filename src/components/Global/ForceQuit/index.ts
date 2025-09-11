import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(() => import('./index.vue'))
