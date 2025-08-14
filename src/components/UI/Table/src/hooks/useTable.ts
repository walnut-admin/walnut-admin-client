import type { WTable } from '../types'
import { isInSetup } from '@/utils/shared'

export function useTable<T>(props: WTable.Hooks.UseTable.Props<T>): WTable.Hooks.UseTable.ReturnType<T> {
  isInSetup()

  const wTableRef = shallowRef<WTable.Inst.WTableInst<T>>()

  const register = (instance: WTable.Inst.WTableInst<T>) => {
    wTableRef.value = instance
  }

  watchEffect(() => {
    props && wTableRef.value?.setProps(unref(props))
  })

  const methods: WTable.Hooks.UseTable.Methods<T> = {
    clearFilters: () => wTableRef.value!.clearFilters!(),
    clearSorter: () => wTableRef.value!.clearSorter!(),
    onApiList: async () => await wTableRef.value!.onApiList(),
    onApiDelete: async id => await wTableRef.value!.onApiDelete(id),
    onApiDeleteMany: async () => await wTableRef.value!.onApiDeleteMany(),
    onGetApiListParams: () => wTableRef.value!.onGetApiListParams(),
  }

  return [register, methods]
}
