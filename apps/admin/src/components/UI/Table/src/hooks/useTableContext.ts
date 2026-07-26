import type { WTable } from '../types'

const key = Symbol(AppConstSymbolKey.TABLE_KEY)
export function setTableContext<T>(ctx: WTable.Context<T>) {
  provide<WTable.Context<T>>(key, ctx)
}
export function useTableContext<T>(): WTable.Context<T> {
  return inject<WTable.Context<T>>(key)!
}
