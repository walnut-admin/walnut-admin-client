import type { App } from 'vue'

import { setupI18n } from '@/locales'
import { setupRouter } from '@/router'
import { setupStore } from '@/store/pinia'
import { isDev } from '@/utils/constant/vue'
import { setupSentry } from './scripts/sentry'

/**
 * @description Entry to set up Vue App
 */
export async function setupApp(app: App) {
  setupStore(app)

  await setupI18n(app)

  const router = setupRouter(app)

  setupSentry(app, router)

  if (isDev())
    app.config.performance = true

  // turbo-console-disable-next-line
  console.info('setupApp', 'App Initializing...')
}
