import type { CredentialResponse } from 'vue3-google-signin'
import { useOneTap } from 'vue3-google-signin'

const userStoreAuth = useAppStoreUserAuth()

export function useGoogleOneTap() {
  useOneTap({
    onSuccess: async (response: CredentialResponse) => {
      await userStoreAuth.AuthWithGoogleFedCM({
        credential: response.credential!,
        select_by: response.select_by!,
      })
    },
    onError: () => console.error('Error with One Tap Login'),
  })
}
