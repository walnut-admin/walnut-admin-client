import type { Plugin, ResolvedConfig } from 'vite'
import type { IconifyPluginOptions } from './types'
import path from 'node:path'
import process from 'node:process'
import { handleProductionMode } from './build'
import { DEFAULT_ICONIFY_OPTIONS, iconBundleCodeMap, iconListCodeMap, RESOLVED_VIRTUAL_MODULE_ICON_BUNDLE, RESOLVED_VIRTUAL_MODULE_ICON_LIST, RESOLVED_VIRTUAL_MODULE_ICON_SET, VIRTUAL_MODULE_ICON_BUNDLE, VIRTUAL_MODULE_ICON_LIST, VIRTUAL_MODULE_ICON_SET } from './const'
import { handleDevelopmentMode, handleHotUpdate } from './dev'

/**
 * Create icon processing plugin
 * @param {IconifyPluginOptions} [options] - Plugin configuration options
 * @returns {Plugin} Vite plugin instance
 */
export function IconifyPlugin(options?: IconifyPluginOptions): Plugin {
  const mergedOptions = { ...DEFAULT_ICONIFY_OPTIONS, ...(options || {}) }
  const getCurrentOpts = () => JSON.parse(JSON.stringify(mergedOptions))
  const currentOpts = getCurrentOpts()
  const { sets, customPrefix } = currentOpts

  const setsCopy = [...sets]
  if (!setsCopy.includes(customPrefix)) {
    setsCopy.unshift(customPrefix)
  }
  mergedOptions.sets = setsCopy

  let pluginConfig: ResolvedConfig

  return {
    name: 'vite-plugin-icon-bundle',

    // Execute after Vite configuration resolution is complete
    async configResolved(resolvedConfig) {
      pluginConfig = resolvedConfig
    },

    // Resolve virtual module ID
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ICON_LIST) {
        return RESOLVED_VIRTUAL_MODULE_ICON_LIST
      }
      if (id === VIRTUAL_MODULE_ICON_SET) {
        return RESOLVED_VIRTUAL_MODULE_ICON_SET
      }
      if (id === VIRTUAL_MODULE_ICON_BUNDLE) {
        return RESOLVED_VIRTUAL_MODULE_ICON_BUNDLE
      }
    },

    // Load virtual module content
    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ICON_BUNDLE) {
        return iconBundleCodeMap.get('default')
      }
      if (id === RESOLVED_VIRTUAL_MODULE_ICON_LIST) {
        return iconListCodeMap.get('default')
      }
      if (id === RESOLVED_VIRTUAL_MODULE_ICON_SET) {
        return `export default ${JSON.stringify(setsCopy)};`
      }
    },

    // Handle HMR
    async handleHotUpdate(ctx) {
      await handleHotUpdate(ctx, getCurrentOpts)
    },

    // Also handle HMR
    configureServer(server) {
      const svgDir = path.resolve(process.cwd(), getCurrentOpts().svgDir)

      // Let chokidar monitor this directory
      server.watcher.add(svgDir)

      server.watcher.on('add', (file) => {
        if (file.endsWith('.svg') && file.startsWith(svgDir)) {
          // Simulate triggering Vite hot update
          server.watcher.emit('change', file)
        }
      })

      server.watcher.on('unlink', (file) => {
        if (file.endsWith('.svg') && file.startsWith(svgDir)) {
          server.watcher.emit('change', file)
        }
      })
    },

    // Execute icon processing logic at the start of build
    async buildStart() {
      try {
        const isDev = pluginConfig.mode === 'development'

        if (isDev) {
          await handleDevelopmentMode(getCurrentOpts())
        }
        else {
          await handleProductionMode(getCurrentOpts(), this)
        }
      }
      catch (err) {
        this.error(`Icon processing failed: ${err instanceof Error ? err.message : String(err)}`)
      }
    },
  }
}
