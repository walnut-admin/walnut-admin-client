import type { StringOrNumber } from 'easy-fns-ts'
import type { WCrud } from './types'
import type { IModels } from '@/api/models'
import { isInSetup } from '@/utils/shared'

export function useCRUD<T extends IModels.Base>(props: WCrud.Hooks.UseCRUD.Props<T>): WCrud.Hooks.UseCRUD.ReturnType<T> {
  isInSetup()

  const wCrudRef = shallowRef<WCrud.Inst.WCrudInst<T>>()

  const register = (instance: WCrud.Inst.WCrudInst<T>) => {
    wCrudRef.value = instance
  }

  watchEffect(() => {
    props && wCrudRef.value?.setProps(unref(props) as WCrud.Props<T>)
  })

  const methods: WCrud.Hooks.UseCRUD.Methods<T> = {
    onOpenCreateForm: v => wCrudRef.value!.onOpenCreateForm(v),
    onReadAndOpenUpdateForm: async (id: StringOrNumber) =>
      await wCrudRef.value!.onReadAndOpenUpdateForm(id),
    onDeleteConfirm: async (id: StringOrNumber) =>
      await wCrudRef.value!.onDeleteConfirm(id),
    onDeleteManyConfirm: async () =>
      await wCrudRef.value!.onDeleteManyConfirm(),
    onGetFormData: () => wCrudRef.value!.onGetFormData(),
    onGetActionType: () => wCrudRef.value!.onGetActionType(),
    onApiList: async () => await wCrudRef.value!.onApiList(),
    onGetApiListParams: () => wCrudRef.value!.onGetApiListParams(),
  }

  return [register, methods]
}
