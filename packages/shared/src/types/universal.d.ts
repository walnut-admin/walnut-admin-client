declare global {
  declare type Fn<T = any, R = T> = (...arg: T[]) => R

  declare type PromiseFn<T = any> = (args?: T) => Promise<void>

  declare type IActionType = 'create' | 'update' | 'detail'
}

export {}
