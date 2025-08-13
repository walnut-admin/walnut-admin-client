import type { Recordable } from 'easy-fns-ts'
import type { Slots } from 'vue'
import { forEach, isArray, isPlainObject, isUndefined, set } from 'lodash-es'
import { renderSlot } from 'vue'

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

export function renderSlots<T extends Recordable>(slots: Slots) {
  const ret: Record<string, Fn> = {}
  Object.keys(slots).forEach((slotName) => {
    ret[slotName] = (scope: T) => renderSlot(slots, slotName, scope)
  })
  return ret
}

// handle undefined to defaultValue
export const getBoolean = (val: any, df = true) => (isUndefined(val) ? df : val)

// get boolean or return value is boolean
export const getFunctionBoolean = <T>(val: any, cbParams: T, defaultVal = true) => (isUndefined(val) ? defaultVal : typeof val === 'boolean' ? val : val(cbParams))

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

export function generateNonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('')
}
