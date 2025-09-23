import { setupStorageMigrations } from '@/utils/persistent/migrate'

// LINK https://utc.yuy1n.io/features/highlight.html#options-1
// TODO build error, did not figure out which plugin conflict
// import '~console/theme-detect'

import { App, setupApp } from './App'
import { installAppPlugins } from './plugins'
// unocss
import 'virtual:uno.css'
// iconify
import 'virtual:icon/bundle'
// LINK https://github.com/unocss/unocss/issues/2127
import '@unocss/reset/tailwind-compat.css'
// animate
import 'animate.css'
// custom scss
import './assets/styles/main.scss'

;

(async () => {
  const app = createApp(App)

  setupStorageMigrations()

  await setupApp(app)

  installAppPlugins()

  app.mount('#app')
})()
