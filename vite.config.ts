import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { loadEnv } from 'vite'

import { envDir, publicDir } from './build/constant'
import { createVitePlugins } from './build/vite/plugin'
import { createViteProxy } from './build/vite/proxy'

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
    gaId: env.VITE_GA_ID,

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
      sentry: {
        enabled: env.VITE_BUILD_SENTRY === 'true',
        dsn: env.VITE_BUILD_SENTRY_DSN,
        org: env.VITE_BUILD_SENTRY_ORG,
        project: env.VITE_BUILD_SENTRY_PROJECT,
        authToken: env.VITE_BUILD_SENTRY_AUTH_TOKEN,
      },
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
    appType: 'spa',

    base: processedEnv.publicPath,
    envDir,
    publicDir,

    define: {
      // https://vue-i18n.intlify.dev/guide/advanced/optimization#feature-build-flags
      '__VUE_I18N_FULL_INSTALL__': false,
      '__VUE_I18N_LEGACY_API__': false,
      // https://github.com/fi3ework/vite-plugin-checker/issues/569
      // https://github.com/vuejs/core/issues/13202#issuecomment-2804421417
      'process.env.NODE_ENV': JSON.stringify('production'),
    },

    plugins: [...createVitePlugins(mode, processedEnv)],

    resolve: {
      alias: {
        '@': pathResolve('src'),
        // https://github.com/axios/axios/issues/5000#issuecomment-1362395864
        'axios/lib': resolve(__dirname, './node_modules/axios/lib'),
      },
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

    build: {
      minify: 'esbuild',
      outDir: processedEnv.build.outDir,
      reportCompressedSize: false,
      // code split would caused build css not work
      cssCodeSplit: false,
      target: 'esnext',
      sourcemap: processedEnv.build.sentry.enabled,

      // ⚠️ Vite 8: rollupOptions 已更名为 rolldownOptions
      // 兼容层会自动转换，但建议显式迁移
      rolldownOptions: {
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

          // Vite 8: Rolldown 默认使用 onlyExplicitManualChunks 行为
          // manualChunks 在 Rolldown 中通过 codeSplitting 配置
          codeSplitting: {
            groups: [
              {
                name: 'vendor',
                test: /[\\/]node_modules[\\/]/,
              },
            ],
          },

          minify: processedEnv.build.dropConsole
            ? {
                compress: {
                  dropConsole: true,
                  dropDebugger: true,
                },
              }
            : undefined,
        },
      },
    },
  }
}
