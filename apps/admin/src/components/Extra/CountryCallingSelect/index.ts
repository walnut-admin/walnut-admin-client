import type { CountryCode } from 'libphonenumber-js'
import type { SelectOption } from 'naive-ui'

export { default } from './index.vue'

export interface ICompExtraCountryCallingSelectProps {
  preferred?: boolean
  flag?: boolean
  disabled?: boolean
  whiteList?: CountryCode[]
  blackList?: CountryCode[]
  autoDefaultCountry?: boolean
}

export type ICompExtraCountryCallingSelectOption = SelectOption & {
  name: string
  iso2: string
  dialCode: string
  priority: number
  areaCodes?: string
}
