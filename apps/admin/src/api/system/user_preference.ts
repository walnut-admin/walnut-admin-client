import type { IResponseData } from '../response'
import type { IStoreUser } from '@/store/types'
import { AppAxios } from '@/utils/axios'

// get user preference
export function getPreferenceAPI() {
  return AppAxios.get<IResponseData.System.User.Preference>(
    {
      url: '/system/user/preference/read',
    },
  )
}

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

// update layout
export function updateLayoutPreferenceAPI(payload: IStoreUser.Preference.Layout) {
  return AppAxios.patch<boolean>(
    {
      url: '/system/user/preference/layout',
      data: payload,
    },
  )
}
