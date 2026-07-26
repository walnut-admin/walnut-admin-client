import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator'
import pkg from '../../../package.json'

const normal = Object.keys(pkg.dependencies).filter(i => !i.startsWith('@'))
const startWithAt = Object.keys(pkg.dependencies).filter(i => i.startsWith('@')).map(i => `vendor-${i.split('/')[0]}`)

export function createObfuscatorPlugin() {
  return vitePluginBundleObfuscator({
    enable: true,
    log: true,
    threadPool: true,
    autoExcludeNodeModules: {
      enable: true,
      // https://github.com/z0ffy/vite-plugin-bundle-obfuscator/issues/122#issuecomment-2568652367
      manualChunks: normal.concat(startWithAt).concat('fuck'),
    },
    options: {
      optionsPreset: 'low-obfuscation',
    },
  })
}
