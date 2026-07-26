import type { CountryCallingCode, CountryCode, NationalNumber, NumberType } from 'libphonenumber-js'

export { default } from './index.vue'

export interface ICompExtraPhoneNumberInputProps {
  flag?: boolean
  countrySelect?: boolean
  preferred?: boolean
  disabled?: boolean
  example?: boolean
  whiteList?: CountryCode[]
  blackList?: CountryCode[]
  autoDefaultCountry?: boolean
  autoFocusAfterCountrySelect?: boolean
  onUpdate?: (val: ICompExtraPhoneNumberInputUpdateParams) => void
}

export interface ICompExtraPhoneNumberInputUpdateParams {
  isValid: boolean
  isPossible?: boolean
  countryCode?: CountryCode
  countryCallingCode?: CountryCallingCode
  nationalNumber?: NationalNumber
  type?: NumberType
  formatInternational?: string
  formatNational?: string
  uri?: string
  e164?: string
  rfc3966?: string
}
