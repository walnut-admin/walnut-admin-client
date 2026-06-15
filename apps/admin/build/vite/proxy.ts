import type { ProxyOptions } from 'vite'

export function createViteProxy(env: IViteEnv) {
  const ret: Record<string, ProxyOptions> = {}

  const api = env.proxy[0]
  const ws = env.proxy[1]

  if (+api[0] === 1) {
    const prefix = api[1]
    const target = api[2]

    ret[prefix] = {
      target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
      secure: false,
      ws: true,
    }
  }

  if (+ws[0] === 1) {
    const prefix = ws[1]
    const target = `${ws[2]}${ws[3]}`

    ret[prefix] = {
      target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
      secure: false,
      ws: true,
    }
  }

  return ret
}
