import type { WForm } from '../types'
import { isInSetup } from '@/utils/shared'

export function useForm<T>(props: WForm.Hooks.UseForm.Props<T>): WForm.Hooks.UseForm.ReturnType<T> {
  isInSetup()

  const wFormRef = shallowRef<WForm.Inst.WFormInst<T>>()

  const register = (instance: WForm.Inst.WFormInst<T>) => {
    wFormRef.value = instance
  }

  watchEffect(() => {
    props && wFormRef.value?.setProps(unref(props))
  })

  const methods: WForm.Hooks.UseForm.Methods<T> = {
    validate: async (fields?: (keyof T)[]) => await (wFormRef.value?.validate(fields) ?? Promise.resolve(false)),
    restoreValidation: () => wFormRef.value?.restoreValidation(),
    onOpen: (beforeHook?: Fn) => wFormRef.value?.onOpen(beforeHook),
    onClose: (close: Fn) => wFormRef.value?.onClose(close),
  }

  return [register, methods]
}
