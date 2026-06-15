/**
 * @description Integrate entry context, expose `setContext` and `getContext` two functions
 */
export function useContext<T>(key: InjectionKey<string | symbol>) {
  const setContext = (ctx: T): void => {
    provide<T>(key, ctx)
  }

  const getContext = (): T => {
    return inject<T>(key)!
  }

  return {
    setContext,
    getContext,
  }
}
