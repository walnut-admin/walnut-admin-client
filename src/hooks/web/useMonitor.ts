const appStoreFingerprint = useAppStoreFingerprint()

export function sendUserMonitorBeacon(data: Partial<AppMonitorUserModel>) {
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

  // route
  watch(
    () => AppRouter.currentRoute.value,
    (v) => {
      sendUserMonitorBeacon({
        currentRouter: v.fullPath,
      })
    },
    {
      immediate: true,
      deep: true,
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
    {
      immediate: true,
    },
  )

  // close page
  useEventListener('beforeunload', () => {
    sendUserMonitorBeacon({
      left: true,
      focus: false,
    })
  })

  tryOnMounted(() => {
    const userStoreAuth = useAppStoreUserAuth()

    sendUserMonitorBeacon({
      auth: !!userStoreAuth.accessToken,
      focus: true,
      left: false,
    })
  })
}
