import { cdn } from 'vite-plugin-cdn2'

export function createCdnImportPlugin() {
  return cdn({
    modules: [],
  })
}
