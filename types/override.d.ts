interface PackagedAuthor {
  name: string
  email: string
  url: string
}

interface PackagedUrls {
  doc: string
  demo: string
}

declare module '~build/package' {
  const name: string
  const version: string
  const author: PackagedAuthor
  const homepage: string

  const urls: PackagedUrls
  const dependencies: Record<string, string>
  const devDependencies: Record<string, string>
}

declare module 'virtual:pwa-register/vue' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'
  import type { Ref } from 'vue'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}

declare module 'virtual:icon/list' {
  const allIcons: string[]
  export default allIcons
}

declare module 'virtual:icon/set' {
  const allSets: string[]
  export default allSets
}

declare module 'virtual:icon/bundle' {

}
