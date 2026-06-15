import type { ValueOf } from 'easy-fns-ts'

export const AppConstSymbolKey = {
  FORM_KEY: 'w-form',
  TABLE_KEY: 'w-table',
  TABS_KEY: 'w-tabs',
  AUTH_KEY: 'w-auth',
  LAYOUT_KEY: 'w-layout',
}

export type ValueOfAppConstSymbolKey = ValueOf<typeof AppConstSymbolKey>
