const appStoreFingerprint = useAppStoreFingerprint()

export const AppSocketEvents = {
  FORCE_QUIT: () => `${appStoreFingerprint.getFingerprint}/force/quit`,
}
