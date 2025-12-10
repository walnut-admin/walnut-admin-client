import { defineConfig } from '@julr/vite-plugin-validate-env'
import { z } from 'zod/v4'
import { VITE_PROXY_VALIDATE, VITE_SHARED_CONFIG } from './shared'

export default defineConfig({
  ...VITE_SHARED_CONFIG(),

  VITE_PORT: z.coerce.number(),
  VITE_HOST: z.string(),
  VITE_PUBLIC_PATH: z.string(),
  VITE_PROXY: VITE_PROXY_VALIDATE(),

  VITE_DEV_CSP: z.coerce.boolean(),
  VITE_DEV_PWA: z.coerce.boolean(),
})
