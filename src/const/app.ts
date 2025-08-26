export const AppConstDevice = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  LAPTOP: 'laptop',
  DESKTOP: 'desktop',
} as const

export type ValueOfAppConstDevice =
  typeof AppConstDevice[keyof typeof AppConstDevice]

export const AppConstLocale = {
  EN_US: 'en_US',
  ZH_CN: 'zh_CN',
} as const

export type ValueOfAppConstLocale =
  typeof AppConstLocale[keyof typeof AppConstLocale]

export const AppConstCollapseMode = {
  ICON: 'icon',
  BAR: 'bar',
  ARROW_CIRCLE: 'arrow-circle',
  BUTTON: 'button',
} as const

export type ValueOfAppConstCollapseMode =
  typeof AppConstCollapseMode[keyof typeof AppConstCollapseMode]

export const AppConstLayoutMode = {
  LEFT_MENU: 'left-menu',
  TOP_MENU: 'top-menu',
} as const

export type ValueOfAppConstLayoutMode =
  typeof AppConstLayoutMode[keyof typeof AppConstLayoutMode]

export const AppConstBackToTopMode = {
  STANDALONE: 'standalone',
  BUILTIN: 'builtin',
} as const

export type ValueOfAppConstBackToTopMode =
  typeof AppConstBackToTopMode[keyof typeof AppConstBackToTopMode]

export const AppConstScrollMode = {
  CONTENT: 'content',
  WRAPPER: 'wrapper',
} as const

export type ValueOfAppConstScrollMode =
  typeof AppConstScrollMode[keyof typeof AppConstScrollMode]

export const AppConstLockMode = {
  DEFAULT: 'default',
  SECURITY: 'security',
  IDLE: 'idle',
} as const

export type ValueOfAppConstLockMode =
  typeof AppConstLockMode[keyof typeof AppConstLockMode]

export const AppConstBasicMode = {
  GLOBAL: 'global',
  SCOPE: 'scope',
} as const

export type ValueOfAppConstBasicMode =
  typeof AppConstBasicMode[keyof typeof AppConstBasicMode]

export const AppConstColorMode = {
  DEFAULT: 'default',
  CAFE: 'cafe',
  CONTRAST: 'contrast',
  GRAYSCALE: 'grayscale',
  GRAYSCALE_INVERTED: 'grayscale-inverted',
  INVERTED: 'inverted',
} as const

export type ValueOfAppConstColorMode =
  typeof AppConstColorMode[keyof typeof AppConstColorMode]

export const AppConstRoles = {
  ROOT: 'root',
  ADMIN: 'admin',
  DEVELOPER: 'developer',
  VISITOR: 'visitor',
} as const

export type ValueOfAppConstRoles =
  typeof AppConstRoles[keyof typeof AppConstRoles]
