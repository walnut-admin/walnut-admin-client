import { createAsyncComponent } from '@/utils/factory/asyncComponent'

export default createAsyncComponent(async () => import('./index.vue'))
