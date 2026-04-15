import { sentryVitePlugin } from '@sentry/vite-plugin'

export function createSentryPlugin(env: IViteEnv) {
  return sentryVitePlugin({
    org: env.build.sentry.org,
    project: env.build.sentry.project,
    authToken: env.build.sentry.authToken,
    telemetry: false,
    sourcemaps: {
      filesToDeleteAfterUpload: [`${env.build.outDir}/*.js.map`, `${env.build.outDir}/**/*.js.map`],
    },
  })
}
