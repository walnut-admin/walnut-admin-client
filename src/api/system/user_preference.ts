import type { IStoreUser } from '@/store/types'
import { AppAxios } from '@/utils/axios'

// update basic
export function updatePreferenceBasicAPI(payload: IStoreUser.Preference.Basic) {
  return AppAxios.patch<boolean>(
    {
      url: '/system/user/preference/basic',
      data: payload,
    },
  )
}

// update accessibility
export function updateAccessibilityPreferenceAPI(payload: IStoreUser.Preference.Accessibility) {
  return AppAxios.patch<boolean>(
    {
      url: '/system/user/preference/accessibility',
      data: payload,
    },
  )
}

// update theme
export function updateThemePreferenceAPI(payload: IStoreUser.Preference.Theme) {
  return AppAxios.patch<boolean>(
    {
      url: '/system/user/preference/theme',
      data: payload,
    },
  )
}
