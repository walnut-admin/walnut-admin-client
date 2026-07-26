import TurboConsole from 'unplugin-turbo-console/vite'
import { name } from '../../../package.json'

export function createTurboConsolePlugin() {
  return TurboConsole({
    highlight: {
      themeDetect: true,
    },
    prefix: name.toLocaleUpperCase(),
  })
}
