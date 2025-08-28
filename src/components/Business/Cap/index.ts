import { createAsyncComponent } from '@/utils/factory/asyncComponent'

const appStoreCapJSToken = useAppStoreCapJSToken()

export default createAsyncComponent(async () => {
  await appStoreCapJSToken.loadCap()
  return import('./index.vue')
})
