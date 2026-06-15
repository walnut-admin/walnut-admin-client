import { merge } from 'lodash-es'

export function useProps<T>(props: T) {
  const propsRef = ref<Partial<T>>()

  /**
   * @description set props
   */
  const setProps = (newProps: T | IDeepMaybeRef<T>) => {
    propsRef.value = merge(unref(propsRef), newProps)
  }

  /**
   * @description get props
   */
  const getProps = computed<T>(() => ({ ...props, ...unref(propsRef) }))

  return { setProps, getProps }
}

export type IHooksUseProps<T> = ReturnType<typeof useProps<T>>
