import { App, setupApp } from './App'

import { setupGoogleAnalytics } from './App/src/scripts/analytics'

// LINK https://utc.yuy1n.io/features/highlight.html#options-1
import '~console/theme-detect'

// unocss
import 'virtual:uno.css'

// LINK https://github.com/unocss/unocss/issues/2127
import '@unocss/reset/tailwind-compat.css'

// animate
import 'animate.css'

// custom scss
import './assets/styles/main.scss'

;

(async () => {
  const app = createApp(App)

  await setupGoogleAnalytics()

  setupStorageMigrations()

  await setupApp(app)

  app.mount('#app')
})()
