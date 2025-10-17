import type { WForm } from '../types'
import type { ICompUIFormHooksItemId } from './useFormItemId'
import { isUndefined } from 'lodash-es'

import { useFormDict } from './useFormDict'

export function useFormSchemas<T>(props: ComputedRef<WForm.Props<T>>, formItemIdCtx: ICompUIFormHooksItemId<T>) {
  const userStorePreference = useAppStoreUserPreference()

  const formSchemas = ref<WForm.Schema.Item<T>[]>([])

  const { formIdMap, getFormItemId, setFormItemId } = formItemIdCtx

  function updateSchema(schema: WForm.Schema.Item<T>[]) {
    formSchemas.value = schema.map((i, idx) => {
      if (isUndefined(getFormItemId(i, idx)))
        setFormItemId(i, idx, true)

      return {
        ...i,
        formProp: {
          ...i.formProp,
          labelWidth: i.formProp?.labelWidth && typeof i.formProp.labelWidth === 'number' ? `${i.formProp.labelWidth / userStorePreference.getFontSize}rem` : i.formProp?.labelWidth,
        },
        _internalShow: getFormItemId(i, idx),
      }
    }) as WForm.Schema.Item<T>[]
  }

  watch(
    () => formIdMap.value,
    () => {
      // do something here
      updateSchema(formSchemas.value as WForm.Schema.Item<T>[])
    },
    { immediate: true, deep: true },
  )

  watch(
    () => props.value.model,
    () => {
      // do something here
      // console.log('WForm: model CHANGED')
    },
    { immediate: true, deep: true },
  )

  watchThrottled(
    () => props.value.schemas,
    (v) => {
      if (!v)
        return

      updateSchema(v)

      useFormDict<T>(formSchemas.value as WForm.Schema.Item<T>[])
    },
    {
      deep: true,
      immediate: true,
      throttle: 200,
    },
  )

  return formSchemas
}
