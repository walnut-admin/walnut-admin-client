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
