import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import qs from 'qs'

export function stringifyQuery(obj: LocationQueryRaw) {
  return qs.stringify(obj)
}

export function parseQuery(query: string) {
  try {
    return qs.parse(query) as LocationQuery
  }
  catch (error) {
    console.warn('Query parse failed, fallback to empty', error)
    return {} as LocationQuery
  }
}
