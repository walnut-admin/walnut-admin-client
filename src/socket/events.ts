const appFingerprint = useAppStoreFingerprint()

export const AppSocketEvents = {
  FORCE_QUIT: () => `${appFingerprint.getFingerprint}/force/quit`,
}
