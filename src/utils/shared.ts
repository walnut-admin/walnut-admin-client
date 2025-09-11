import type { Recordable } from 'easy-fns-ts'
import type { Slots } from 'vue'
import type { IAxios } from './axios/types'
import { Base64 } from 'js-base64'
import { forEach, isArray, isPlainObject, isUndefined, set } from 'lodash-es'

export function getDefaultSlotText(slots: Slots): string {
  const str = (slots.default && slots.default()[0].children) as string

  if (str)
    return str.trimStart().trimEnd()

  return ''
}

export function isInSetup() {
  if (!getCurrentInstance())
    console.error('IsInSetup', 'Hook can only be used in `setup` function!')
}

// handle undefined to defaultValue
export const getBoolean = (val: any, df = true) => (isUndefined(val) ? df : val)

// get boolean or return value is boolean
export const getFunctionBoolean = <T>(val: any, cbParams: T, defaultVal = true) => (isUndefined(val) ? defaultVal : typeof val === 'boolean' ? val : val(cbParams))

/**
 * @description mock list endpoint
 */
export function mockListApi<T>(arr: T[]) {
  return (params: IAxios.BaseListParams) => {
    const num = params.page?.page || 1
    const size = params.page?.pageSize || 10
    const total = arr.length

    return {
      data: arr.slice((num - 1) * size, (num - 1) * size + size),
      total,
    }
  }
}

// easy detect device type
export function detectDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase()

  if (/mobile/i.test(userAgent)) {
    return 'Mobile'
  }
  else if (/tablet/i.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent))) {
    return 'Tablet'
  }
  else {
    return 'Desktop'
  }
}

// get cpu core count
export function getCPUCoreCount() {
  if ('hardwareConcurrency' in navigator) {
    return navigator.hardwareConcurrency
  }
  else {
    console.warn('navigator.hardwareConcurrency is not supported')
    return 0
  }
}

// get memory in gb
export function getMemoryGB() {
  if ('deviceMemory' in navigator) {
    return navigator.deviceMemory
  }
  else {
    console.warn('navigator.deviceMemory is not supported')
    return 0
  }
}

// get cpu archittecture
export async function getGPUArchitecture() {
  try {
    if ('gpu' in navigator) {
    // @ts-expect-error quite new API
      const adapter = await navigator.gpu.requestAdapter()

      if (!adapter) {
        console.warn('webGPU adapter is not supported')
        return 'not supported'
      }

      const device = await adapter.requestDevice()

      return device.adapterInfo.architecture
    }
    else {
      console.warn('navigator.gpu is not supported')
      return 'not supported'
    }
  }
  catch (error) {
    console.error(error)
    return 'not supported'
  }
}

export function objectToPaths<T>(obj: T) {
  const result: Recordable = {}

  function process(value: any, path: string) {
    if (isPlainObject(value)) {
      forEach(value, (v, k) => {
        process(v, path ? `${path}.${k}` : k)
      })
    }
    else if (isArray(value)) {
      forEach(value, (v, i) => {
        process(v, path ? `${path}[${i}]` : `[${i}]`)
      })
    }
    else {
      result[path] = value
    }
  }

  process(obj, '')
  return result
}

export function pathsToObject<T extends object, R extends Recordable = T>(pathsObj: T): R {
  const result: Recordable = {}

  forEach(pathsObj, (value, path) => {
    set(result, path, value)
  })

  return result as R
}

export function toUrlSafeBase64(b64: string): string {
  return Base64.toBase64(b64, true)
}

export function fromUrlSafeBase64(b64url: string): string {
  return Base64.fromBase64(b64url)
}
