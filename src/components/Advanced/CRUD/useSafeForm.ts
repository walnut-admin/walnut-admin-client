import type { WCrud } from './types'
import type { IModels } from '@/api/models'
import { isEqual, omit } from 'lodash-es'

const tempStorageMap = ref(new Map())
const freezeInitStorageMap = ref(new Map())

export function useSafeForm<T extends IModels.Base>(
  formData: Ref<T>,
  props: ComputedRef<WCrud.Props<T>>,
  actionType: Ref<IActionType>,
) {
  const getStorageKey = computed(() => `${props.value.safeFormKey}-${actionType.value}`)

  const getTempStorage = computed(() => toRaw(tempStorageMap.value.get(getStorageKey.value)))

  const getIsFormModified = computed(() => {
    if (!props.value.safeForm)
      return false
    const newData = getTempStorage.value
    const initData = toRaw(freezeInitStorageMap.value.get(getStorageKey.value))
    return !isEqual(newData, initData)
  })

  const onInitStorage = () => {
    formData.value = Object.assign(formData.value!, getTempStorage.value)
    freezeInitStorageMap.value.set(getStorageKey.value, getTempStorage.value)
  }

  const onClearStorage = () => {
    tempStorageMap.value.delete(getStorageKey.value)
    freezeInitStorageMap.value.delete(getStorageKey.value)
  }

  const getWantedFormData = computed(() => {
    const cloned = JSON.parse(JSON.stringify(formData.value))
    return omit(cloned, props.value.safeFormUnwantedFields!)
  })

  watch(
    () => getWantedFormData.value,
    async (newV) => {
      if (!newV)
        return

      if (Object.keys(newV).length) {
        tempStorageMap.value.set(getStorageKey.value, newV)
      }
    },
    { immediate: true, deep: true },
  )

  return { onClearStorage, onInitStorage, getIsFormModified }
}
