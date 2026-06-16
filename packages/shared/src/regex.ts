/**
 * @description Curries a predicate function to check if value matches pattern.
 */
const isPattern = (pattern: RegExp) => (value: string) => pattern.test(value)

// regex for international phone number
// https://stackoverflow.com/a/6967885
const phoneRegex
  = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[981-6]\d|9[80-5]|8[6421]|6[0-6]|5[1-8]|4[3-910]|3[960-4]|2[70]|7|1)\d{1,14}$/

const emailRegex
  = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i

export const isPhoneNumber = isPattern(phoneRegex)

export const isEmailAddress = isPattern(emailRegex)
