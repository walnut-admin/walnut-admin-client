import { defineConfig } from '@julr/vite-plugin-validate-env'
import { z } from 'zod/v4'
import { VITE_KEY_IV_VALIDATE, VITE_PROXY_VALIDATE } from './shared'

export default defineConfig({
  VITE_PUBLIC_PATH: z.string(),

  VITE_PROXY: VITE_PROXY_VALIDATE(),

  VITE_CRYPTO_URL: VITE_KEY_IV_VALIDATE(),

  VITE_SECONDS_AXIOS_TIMEOUT: z.coerce.number(),
  VITE_SECONDS_AXIOS_CACHE: z.coerce.number(),
  VITE_SECONDS_PERSIST: z.coerce.number(),

  VITE_BUILD_OUT_DIR: z.string(),
  VITE_BUILD_OBFUSCATOR: z.coerce.boolean(),
  VITE_BUILD_DROP_CONSOLE: z.coerce.boolean(),
  VITE_BUILD_CDN: z.coerce.boolean(),
  VITE_BUILD_COMPRESSION: z.coerce.boolean(),
  VITE_BUILD_ANALYZER: z.coerce.boolean(),
  VITE_BUILD_BANNER: z.coerce.boolean(),
  VITE_BUILD_DISABLE_BROWSER_DEVTOOL: z.coerce.boolean(),
})
