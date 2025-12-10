import { z } from 'zod'

export function VITE_PROXY_VALIDATE() {
  return z.preprocess((v: unknown) => typeof v === 'string' && JSON.parse(v), z.tuple(
    [
      z.tuple([
        z.coerce.number(),
        z.string(),
        // https://github.com/colinhacks/zod/discussions/1254#discussioncomment-6395482
        z.string().url().optional().or(z.literal('')),
      ]),
      z.tuple([
        z.coerce.number(),
        z.string(),
        // https://github.com/colinhacks/zod/discussions/1254#discussioncomment-6395482
        z.string().url().optional().or(z.literal('')),
        z.string(),
        z.string(),
      ]),
    ],
  ))
}

export function VITE_SENTRY_CONFIG() {
  return {
    VITE_BUILD_SENTRY: z.coerce.boolean(),
    VITE_BUILD_SENTRY_DSN: z.string(),
    VITE_BUILD_SENTRY_ORG: z.string(),
    VITE_BUILD_SENTRY_PROJECT: z.string(),
    VITE_BUILD_SENTRY_AUTH_TOKEN: z.string(),
  }
}

export function VITE_SHARED_CONFIG() {
  return {
    VITE_APP_TITLE: z.string(),
    VITE_GA_ID: z.string(),
    VITE_GOOGLE_CLIENT_ID: z.string(),

    VITE_SECONDS_AXIOS_TIMEOUT: z.coerce.number(),
    VITE_SECONDS_AXIOS_CACHE: z.coerce.number(),
    VITE_SECONDS_PERSIST: z.coerce.number(),
  }
}
