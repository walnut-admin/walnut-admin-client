import type { ValueOf } from 'easy-fns-ts'

export const AppConstMenuType = {
  CATALOG: 'catalog',
  MENU: 'menu',
  ELEMENT: 'element',
} as const

export const AppConstMenuTernal = {
  EXTERNAL: 'external',
  INTERNAL: 'internal',
  NONE: 'none',
} as const

export const AppConstCacheKeyStrategy = {
  NAME: 'name',
  PATH: 'path',
  CUSTOM: 'custom',
} as const

export type ValueOfAppConstMenuType = ValueOf<typeof AppConstMenuType>
export type ValueOfAppConstMenuTernal = ValueOf<typeof AppConstMenuTernal>
export type ValueOfAppConstCacheKeyStrategy = ValueOf<typeof AppConstCacheKeyStrategy>
