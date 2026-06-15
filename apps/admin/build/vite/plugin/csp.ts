import csp from 'vite-plugin-csp-guard'

export function createCSPPlugin(env: IViteEnv) {
  return csp({
    features: {
      cssInJs: true,
      mpa: false,
    },
    // debug: true,
    // override: false,
    type: 'SPA',
    algorithm: 'sha256',
    dev: {
      run: env.dev.csp, // Run the plugin in dev mode
      outlierSupport: ['vue', 'tailwind', 'scss'],
    },
    policy: {
      // 限制所有资源类型的默认源
      'default-src': ['\'self\'', 'https:'],

      // 限制脚本来源
      'script-src': ['\'self\'', '\'unsafe-inline\'', 'https:', 'http:'],

      // 限制样式表来源
      'style-src': ['\'self\'', '\'unsafe-inline\'', 'https:'],

      // 限制图像来源
      'img-src': ['\'self\'', 'data:', 'https:', 'http:', 'blob:'],

      // 限制字体来源
      'font-src': ['\'self\'', 'data:', 'https:', 'http:'],

      // 限制媒体文件来源
      'media-src': ['\'self\'', 'https:', 'http:'],

      // 限制框架来源
      'frame-src': ['\'self\'', 'https:', 'http:'],

      // 限制 WebSocket 和 EventSource 连接
      'connect-src': ['\'self\'', 'https:', 'http:'],

      // 限制 worker 脚本来源
      'worker-src': ['\'self\'', 'blob:'],

      // 限制浏览器自动填充表单
      'form-action': ['\'self\'', 'https:', 'http:'],

      'script-src-elem': ['\'self\'', 'https:', '\'unsafe-inline\''],
      'style-src-elem': ['\'self\'', '\'unsafe-inline\''],

      // 'default-src': ['\'self\'', 'https:'],
      // 'script-src': ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\'', 'https://*.googletagmanager.com'],
      // 'style-src': ['\'self\'', '\'unsafe-inline\''],
      // 'img-src': ['\'self\'', 'data:', 'https:', 'blob:', 'https://*.google-analytics.com', 'https://*.googletagmanager.com'],
      // 'font-src': ['\'self\'', 'data:', 'https://fonts.gstatic.com'],
      // 'worker-src': ['\'self\'', 'blob:'],
      // 'connect-src': ['http:', 'wss:', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'],
    },
    build: {
      // https://github.com/vitejs/vite/issues/2377#issuecomment-2571422093
      sri: false,
      outlierSupport: ['vue-router'],
    },
  })
}
