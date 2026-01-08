import type { IModels } from '@/api/models'
import { layoutConst } from '@/router/routes/builtin'

const appStoreFingerprint = useAppStoreFingerprint()

export function sendUserMonitorBeacon(data: Partial<IModels.AppMonitorUser>) {
  const { httpUrl } = useAppEnvProxy()

  const blob = new Blob(
    [
      JSON.stringify({
        ...data,
        visitorId: appStoreFingerprint.getFingerprint,
      }),
    ],
    { type: 'application/json; charset=UTF-8' },
  )

  if (data.currentRouter === layoutConst.root.path)
    return

  navigator.sendBeacon(`${httpUrl}/app/monitor/user/state`, blob)
}

export function useAppUserMonitor() {
  const isVisible = useSharedDocumentVisibility()
  const userStoreAuth = useAppStoreUserAuth()

  // route
  watch(
    () => AppRouter.currentRoute.value,
    (v) => {
      sendUserMonitorBeacon({
        currentRouter: v.fullPath,
        auth: !!userStoreAuth.getAccessToken,
        focus: true,
        left: false,
      })
    },
    {
      immediate: true,
    },
  )

  // hidden
  watch(
    () => isVisible.value,
    (v) => {
      sendUserMonitorBeacon({
        focus: v,
      })
    },
  )

  // close page
  useEventListener('beforeunload', () => {
    sendUserMonitorBeacon({
      left: true,
      focus: false,
    })
  })
}
