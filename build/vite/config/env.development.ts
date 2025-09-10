import { defineConfig } from '@julr/vite-plugin-validate-env'
import { z } from 'zod/v4'
import { VITE_PROXY_VALIDATE } from './shared'

export default defineConfig({
  VITE_APP_TITLE: z.string(),
  VITE_GA_ID: z.string(),

  VITE_PORT: z.coerce.number(),
  VITE_HOST: z.string(),
  VITE_PUBLIC_PATH: z.string(),
  VITE_PROXY: VITE_PROXY_VALIDATE(),

  VITE_DEV_CSP: z.coerce.boolean(),
  VITE_DEV_PWA: z.coerce.boolean(),

  VITE_SECONDS_AXIOS_TIMEOUT: z.coerce.number(),
  VITE_SECONDS_AXIOS_CACHE: z.coerce.number(),
  VITE_SECONDS_PERSIST: z.coerce.number(),
})
