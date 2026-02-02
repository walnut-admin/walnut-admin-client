import type { ValueOf } from 'easy-fns-ts'

export const AppConstDevice = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  LAPTOP: 'laptop',
  DESKTOP: 'desktop',
} as const

export type ValueOfAppConstDevice = ValueOf<typeof AppConstDevice>

export const AppConstFontSize = {
  EN_US: 'en_US',
  ZH_CN: 'zh_CN',
} as const

export type ValueOfAppConstFontSize = ValueOf<typeof AppConstFontSize>

export const AppConstLocale = {
  EN_US: 'en_US',
  ZH_CN: 'zh_CN',
} as const

export type ValueOfAppConstLocale = ValueOf<typeof AppConstLocale>

export const AppConstCollapseMode = {
  ICON: 'icon',
  BAR: 'bar',
  ARROW_CIRCLE: 'arrow-circle',
  BUTTON: 'button',
} as const

export type ValueOfAppConstCollapseMode = ValueOf<typeof AppConstCollapseMode>

export const AppConstLayoutMode = {
  LEFT_MENU: 'left-menu',
  TOP_MENU: 'top-menu',
} as const

export type ValueOfAppConstLayoutMode = ValueOf<typeof AppConstLayoutMode>

export const AppConstScrollMode = {
  CONTENT: 'content',
  WRAPPER: 'wrapper',
} as const

export type ValueOfAppConstScrollMode = ValueOf<typeof AppConstScrollMode>

export const AppConstLockMode = {
  DEFAULT: 'default',
  SECURITY: 'security',
  IDLE: 'idle',
} as const

export type ValueOfAppConstLockMode = ValueOf<typeof AppConstLockMode>

export const AppConstBasicMode = {
  GLOBAL: 'global',
  SCOPE: 'scope',
} as const

export type ValueOfAppConstBasicMode = ValueOf<typeof AppConstBasicMode>

export const AppConstColorMode = {
  DEFAULT: 'default',
  CAFE: 'cafe',
  CONTRAST: 'contrast',
  GRAYSCALE: 'grayscale',
  GRAYSCALE_INVERTED: 'grayscale-inverted',
  INVERTED: 'inverted',
} as const

export type ValueOfAppConstColorMode = ValueOf<typeof AppConstColorMode>

export const AppConstRoles = {
  ROOT: 'root',
  ADMIN: 'admin',
  DEVELOPER: 'developer',
  VISITOR: 'visitor',
} as const

export type ValueOfAppConstRoles = ValueOf<typeof AppConstRoles>

export const AppConstRequestHeaders = {
  AUTHORIZATION: 'Authorization',
  LANGUAGE: 'x-language',
  FINGERPRINT: 'x-fingerprint',
  SIGN: 'x-sign',
  TIMESTAMP: 'x-timestamp',
  NONCE: 'x-nonce',
} as const

export type ValueOfAppConstRequestHeaders = ValueOf<typeof AppConstRequestHeaders>
