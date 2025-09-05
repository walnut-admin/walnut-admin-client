import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import devtoolsJson from 'vite-plugin-devtools-json'
import { creatAutoImportPlugin } from './auto-import'
import { createBannerPlugin } from './banner'
import { createCdnImportPlugin } from './cdn-import'
// import { createCheckerPlugin } from './checker'
import { createComponentPlugin } from './component'
import { createCompressionPlugin } from './compression'
import { createDevtoolsPlugin } from './devtool'
import { createHttpsPlugin } from './https'
import { createImageOptimizerPlugin } from './image-optimizer'
import { createInfoPlugin } from './info'
// import { createLegacyPlugin } from './legacy'
import { createObfuscatorPlugin } from './obfuscator'
// import { createPWAPlugin } from './pwa'
// import { createCSPPlugin } from './csp'
import { createRestartPlugin } from './restart'
import { createTurboConsolePlugin } from './turbo-console'
import { createUnoCSSPlugin } from './unocss'
import { creatValidateEnvPlugin } from './validate-env'
import { createVisualizerPlugin } from './visualizer'

export function createVitePlugins(mode: string, env: IViteEnv) {
  const dev = mode === 'development'

  const vitePlugins: PluginOption = [
    // https://github.com/tsotimus/vite-plugin-csp-guard
    // https://github.com/tsotimus/vite-plugin-csp-guard/issues/265
    // https://github.com/vitejs/vite/issues/2377#issuecomment-2571422093
    // createCSPPlugin(env),

    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('cropper-') || tag === 'cap-widget',
        },
      },
    }),
    vueJsx(),

    // https://github.com/Julien-R44/vite-plugin-validate-env
    creatValidateEnvPlugin(mode),

    // https://github.com/yjl9903/unplugin-info
    createInfoPlugin(),

    // https://github.com/antfu/unplugin-auto-import
    creatAutoImportPlugin(),

    // https://github.com/antfu/unplugin-vue-components
    createComponentPlugin(),

    // https://github.com/unocss/unocss
    createUnoCSSPlugin(),

    // https://github.com/fi3ework/vite-plugin-checker
    // createCheckerPlugin(),
  ]

  // I'm pretty sure packages below will be removed when build
  // It's just a symbol to tell you that when this plugin will be used
  if (dev) {
    // https://github.com/ChromeDevTools/vite-plugin-devtools-json
    vitePlugins.push(devtoolsJson())

    // https://github.com/vuejs/devtools
    vitePlugins.push(createDevtoolsPlugin())

    // https://github.com/unplugin/unplugin-turbo-console
    vitePlugins.push(createTurboConsolePlugin())

    // https://github.com/antfu/vite-plugin-restart
    vitePlugins.push(createRestartPlugin())

    // https://github.com/liuweiGL/vite-plugin-mkcert
    vitePlugins.push(createHttpsPlugin())
  }
  else {
    // https://github.com/FatehAK/vite-plugin-image-optimizer
    vitePlugins.push(createImageOptimizerPlugin())

    // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
    // vitePlugins.push(createLegacyPlugin())

    // https://github.com/nonzzz/vite-plugin-cdn
    env.build.cdn && vitePlugins.push(createCdnImportPlugin())

    // https://github.com/nonzzz/vite-plugin-compression
    env.build.compression && vitePlugins.push(createCompressionPlugin())

    // https://github.com/z0ffy/vite-plugin-bundle-obfuscator
    env.build.obfuscator && vitePlugins.push(createObfuscatorPlugin())

    // https://github.com/chengpeiquan/vite-plugin-banner
    env.build.banner && vitePlugins.push(createBannerPlugin(env.build.outDir))

    // https://github.com/nonzzz/vite-bundle-analyzer
    env.build.analyzer && vitePlugins.push(createVisualizerPlugin(env.title))
  }

  // https://github.com/vite-pwa/vite-plugin-pwa
  // vitePlugins.push(createPWAPlugin(env))

  return vitePlugins
}
