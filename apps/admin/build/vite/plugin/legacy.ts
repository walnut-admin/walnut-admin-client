import legacy from '@vitejs/plugin-legacy'

export function createLegacyPlugin() {
  return legacy({
    targets: ['last 10 versions and not dead, > 0.3%, Firefox ESR'],
  })
}
