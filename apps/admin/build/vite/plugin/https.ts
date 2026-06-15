import mkcert from 'vite-plugin-mkcert'

export function createHttpsPlugin() {
  return mkcert({ source: 'coding' })
}
