export const AppConstTabDeleteType = {
  TAB_SINGLE: 'TAB_SINGLE',
  TAB_LEFT: 'TAB_LEFT',
  TAB_RIGHT: 'TAB_RIGHT',
  TAB_OTHER: 'TAB_OTHER',
  TAB_ALL: 'TAB_ALL',
} as const

export type ValueOfAppConstTabDeleteType
  = typeof AppConstTabDeleteType[keyof typeof AppConstTabDeleteType]

export const AppConstTabUtilsShowMode = {
  ALWAYS: 'always',
  OVERFLOW: 'overflow',
} as const

export type ValueOfAppConstTabUtilsShowMode
  = typeof AppConstTabUtilsShowMode[keyof typeof AppConstTabUtilsShowMode]

export const AppConstTabStyleMode = {
  ROUND: 'round',
  FLEX: 'flex',
  CARD: 'card',
} as const

export type ValueOfAppConstTabStyleMode
  = typeof AppConstTabStyleMode[keyof typeof AppConstTabStyleMode]

export const AppConstTabCloseMode = {
  ALWAYS: 'always',
  HOVER: 'hover',
} as const

export type ValueOfAppConstTabCloseMode
  = typeof AppConstTabCloseMode[keyof typeof AppConstTabCloseMode]

export const AppConstTabAffixMode = {
  ICON: 'icon',
  PIN: 'pin',
} as const

export type ValueOfAppConstTabAffixMode
  = typeof AppConstTabAffixMode[keyof typeof AppConstTabAffixMode]
