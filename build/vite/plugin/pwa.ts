import { VitePWA } from 'vite-plugin-pwa'
import pkg from '../../../package.json'

// https://alexop.dev/posts/create-pwa-vue3-vite-4-steps/
// still got problems, but offline mode seem to work in dev mode
// network filter: -is:service-worker-initiated -is:service-worker-intercepted
export function createPWAPlugin(env: IViteEnv) {
  return VitePWA({
    registerType: 'prompt',
    strategies: 'generateSW',
    injectRegister: 'auto',
    includeAssets: ['favicon.ico', '/assets/apple-touch-icon-180x180.png', '/pwa/maskable-icon-512x512.png'],
    pwaAssets: {
      preset: 'minimal-2023',
      overrideManifestIcons: true,
    },
    manifest: {
      id: pkg.name,
      name: pkg.name,
      short_name: pkg.name,
      description: pkg.description,
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      disableDevLogs: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script'
            || request.destination === 'worker',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: env.dev.pwa,
      type: 'module',
      navigateFallback: 'index.html',
      suppressWarnings: true,
    },
  })
}
