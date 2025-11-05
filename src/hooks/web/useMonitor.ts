import type { IModels } from '@/api/models'

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

  if (data.currentRouter === AppRootPath)
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
        auth: !!userStoreAuth.accessToken,
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
