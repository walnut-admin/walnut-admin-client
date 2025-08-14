import { setupStorageMigrations } from '@/utils/persistent/migrate'
import { App, setupApp, setupAppScripts } from './App'

// LINK https://utc.yuy1n.io/features/highlight.html#options-1
// TODO build error, did not figure out which plugin conflict
// import '~console/theme-detect'

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

  await setupAppScripts()

  setupStorageMigrations()

  await setupApp(app)

  app.mount('#app')
})()
