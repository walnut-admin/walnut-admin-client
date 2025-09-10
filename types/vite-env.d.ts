type ImportMetaEnvAugmented = import('@julr/vite-plugin-validate-env').ImportMetaEnvAugmented<
  typeof import('../build/vite/config/env.development').default
  & typeof import('../build/vite/config/env.staging').default
>

interface ViteTypeOptions {
  // Avoid adding an index type to `ImportMetaDev` so
  // there's an error when accessing unknown properties.
  // ⚠️ This option requires Vite 6.3.x or higher
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv extends ImportMetaEnvAugmented {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface IViteEnv {
  port: number
  host: string
  title: string
  publicPath: string
  proxy: [[number, string, string], [number, string, string, string, string]]
  gaId: string

  dev: {
    csp: boolean
    pwa: boolean
  }

  build: {
    outDir: string
    obfuscator: boolean
    dropConsole: boolean
    compression: boolean
    analyzer: boolean
    banner: boolean
    cdn: boolean
    disableBrowserDevtool: boolean
  }
}
