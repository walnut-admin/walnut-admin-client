import type { WTable } from '../types'

export function useTableMethods(tableRef: Ref<WTable.Inst.NDataTableInst | null>) {
  function clearFilters() {
    tableRef.value?.clearFilters()
  }
  function clearSorter() {
    tableRef.value?.clearSorter()
  }

  return {
    clearFilters,
    clearSorter,
  }
}

export type ICompUITableHooksMethods = ReturnType<typeof useTableMethods>
