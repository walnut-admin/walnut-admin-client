import type { AxiosAdapter } from 'axios'
import { nanoid } from 'nanoid'

export function idAdapter(adapter: AxiosAdapter): AxiosAdapter {
  return async (config) => {
    const requestId = nanoid(16)
    config._requestId = requestId
    return await adapter(config)
  }
}
