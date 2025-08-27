import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import { isUrlEncrypted, urlDecrypt, urlEncrypt } from '@/utils/url-masking'
import superjson from 'superjson'

const appSetting = useAppStoreSetting()

export function stringifyQuery(obj: LocationQueryRaw) {
  if (!obj || Object.keys(obj).length === 0)
    return ''

  const str = superjson.stringify(obj)

  if (appSetting.app.urlMasking) {
    return urlEncrypt(str)
  }

  return str
}

const whiteList = [AppOpenExternalPath]

export function parseQuery(query: string) {
  try {
    if (whiteList.includes(window.location.pathname))
      return superjson.parse(query) as LocationQuery

    if (appSetting.app.urlMasking && isUrlEncrypted(query)) {
      return superjson.parse(urlDecrypt(query)) as LocationQuery
    }

    return superjson.parse(query) as LocationQuery
  }
  catch (error) {
    console.warn('Query decryption failed, fallback to empty', error)
    return {} as LocationQuery
  }
}
