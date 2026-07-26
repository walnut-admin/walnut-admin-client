import type { CredentialResponse, PromptMomentNotification } from 'vue3-google-signin'
import { useOneTap } from 'vue3-google-signin'

const userStoreAuth = useAppStoreUserAuth()

export function useGoogleOneTap() {
  return useOneTap({
    disableAutomaticPrompt: true,
    onSuccess: async (response: CredentialResponse) => {
      try {
        await userStoreAuth.AuthWithGoogleFedCM({
          credential: response.credential!,
          select_by: response.select_by!,
        })
      }
      finally {
        userStoreAuth.setLoading(false)
      }
    },
    onError: () => {
      userStoreAuth.setLoading(false)
      console.error('Error with One Tap Login')
    },
    onPromptMomentNotification: (notification: PromptMomentNotification) => {
      if (notification.isSkippedMoment()) {
        userStoreAuth.setLoading(false)
      }
    },
  })
}
