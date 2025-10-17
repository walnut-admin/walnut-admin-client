import ViteRestart from 'vite-plugin-restart'

export function createRestartPlugin() {
  return ViteRestart({
    reload: ['src/settings-dev.json'],
    restart: ['package.json'],
  })
}
