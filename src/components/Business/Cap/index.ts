import { createAsyncComponent } from '@/utils/factory/asyncComponent'

const appCapJSToken = useAppStoreCapJSToken()

export default createAsyncComponent(async () => {
  await appCapJSToken.loadCap()
  return import('./index.vue')
})
