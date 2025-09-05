import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { loadEnv } from 'vite'

import { envDir, publicDir } from './build/constant'
import { createVitePlugins } from './build/vite/plugin'
import { createViteProxy } from './build/vite/proxy'

import { dependencies } from './package.json'

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

function useBuildEnv(env: Record<keyof ImportMetaEnv, string>): IViteEnv {
  return {
    port: +env.VITE_PORT,
    host: env.VITE_HOST,
    title: env.VITE_APP_TITLE,
    publicPath: env.VITE_PUBLIC_PATH,
    proxy: JSON.parse(env.VITE_PROXY as string),

    dev: {
      csp: env.VITE_DEV_CSP === 'true',
      pwa: env.VITE_DEV_PWA === 'true',
    },

    build: {
      outDir: env.VITE_BUILD_OUT_DIR,
      obfuscator: env.VITE_BUILD_OBFUSCATOR === 'true',
      dropConsole: env.VITE_BUILD_DROP_CONSOLE === 'true',
      compression: env.VITE_BUILD_COMPRESSION === 'true',
      analyzer: env.VITE_BUILD_ANALYZER === 'true',
      banner: env.VITE_BUILD_BANNER === 'true',
      cdn: env.VITE_BUILD_CDN === 'true',
      disableBrowserDevtool: env.VITE_BUILD_DISABLE_BROWSER_DEVTOOL === 'true',
    },
  }
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = cwd()

  const env = loadEnv(mode, envDir) as Record<keyof ImportMetaEnv, string>

  const processedEnv = useBuildEnv(env)

  return {
    root,

    base: processedEnv.publicPath,

    envDir,

    publicDir,

    define: {
      // https://vue-i18n.intlify.dev/guide/advanced/optimization#feature-build-flags
      __VUE_I18N_FULL_INSTALL__: false,
      __VUE_I18N_LEGACY_API__: false,
    },

    plugins: [...createVitePlugins(mode, processedEnv)],

    resolve: {
      alias: {
        '@': pathResolve('src'),
        // https://github.com/axios/axios/issues/5000#issuecomment-1362395864
        'axios/lib': resolve(__dirname, './node_modules/axios/lib'),
      },
    },

    css: {},

    esbuild: {
      drop: processedEnv.build.dropConsole ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },

    server: {
      host: processedEnv.host,

      port: processedEnv.port,

      proxy: createViteProxy(processedEnv),

      open: '/',

      hmr: {
        overlay: false,
      },
    },

    preview: {
      port: 8080,
      strictPort: true,
      host: true,
      open: true,
    },

    optimizeDeps: {
      include: Object.keys(dependencies),
    },

    build: {
      minify: 'esbuild',
      outDir: processedEnv.build.outDir,
      reportCompressedSize: false,
      // code split would caused build css not work
      cssCodeSplit: false,
      target: 'esnext',

      chunkSizeWarningLimit: 600,

      rollupOptions: {
        output: {
          format: 'es',
          // https://github.com/vitejs/vite-plugin-vue/issues/19#issuecomment-3087602546
          chunkFileNames: (assetInfo: { name: string }) => {
            const name = assetInfo.name.endsWith('.vue_vue_type_style_index_0_lang')
              || assetInfo.name.endsWith('.vue_vue_type_script_setup_true_lang')
              ? assetInfo.name.split('.')[0]
              : assetInfo.name
            return `static/js/${name}-[hash].js`
          },
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',

          // https://github.com/vitejs/vite/discussions/9440#discussioncomment-8358001
          manualChunks(id: string) {
            // List of modules that rollup sometimes bundles with manual chunks, causing those chunks to be eager-loaded
            const ROLLUP_COMMON_MODULES = [
              'vite/preload-helper',
              'vite/modulepreload-polyfill',
              'vite/dynamic-import-helper',
              'commonjsHelpers',
              'commonjs-dynamic-modules',
              '__vite-browser-external',
            ]

            // https://github.com/vitejs/vite/issues/5189#issuecomment-2175410148
            if (ROLLUP_COMMON_MODULES.some(commonModule => id.includes(commonModule))) {
              return 'fuck'
            }

            if (id.includes('node_modules')) {
              const modulePath = id.split('node_modules/')[1]
              const topLevelFolder = modulePath.split('/')[0]
              if (topLevelFolder !== '.pnpm') {
                return topLevelFolder
              }
              const scopedPackageName = modulePath.split('/')[1]
              const chunkName = scopedPackageName.split('@')[scopedPackageName.startsWith('@') ? 1 : 0]
              return chunkName
            }
          },
        },
      },
    },
  }
}
