import type { HmrContext } from 'vite'
import type { IconifyPluginOptions } from './types'
import path from 'node:path'
import process from 'node:process'
import { iconBundleCodeMap, iconListCodeMap, RESOLVED_VIRTUAL_MODULE_ICON_BUNDLE, RESOLVED_VIRTUAL_MODULE_ICON_LIST } from './const'
import { cleanName } from './shared'
import { buildCustomSvgObject } from './svg'

/**
 * Generate icon list and bundle for development mode
 * @param {IconifyPluginOptions} options - Plugin options
 * @returns {Promise<{bundleCode: string, listCode: string}>} Generated bundle and list code
 */
async function generateDevIconListAndBundle(options: IconifyPluginOptions) {
  const { sets, customPrefix } = options

  const names = sets.filter(i => i !== customPrefix)

  const customJson = await buildCustomSvgObject(customPrefix)

  // 1. iconBundle
  const jsonImports = names
    .map(n => `import ${cleanName(n)} from '@iconify/json/json/${n}.json';`)
    .join('\n')

  const addCalls = names
    .map(n => `addCollection(${cleanName(n)});`)
    .join('\n')

  const bundleCode = `
import { addCollection } from '@iconify/vue';
${jsonImports}
${addCalls}
addCollection(${JSON.stringify(customJson)});
`

  // 2. iconList
  const listCode = `
${jsonImports}
const custom = ${JSON.stringify(customJson)};
const pools = [${names.map(cleanName).join(',')}, custom]
const iconList = []
pools.forEach(pool => {
  Object.keys(pool.icons).forEach(key => iconList.push(pool.prefix + ':' + key))
})
export default iconList
`

  return { bundleCode, listCode }
}

/**
 * Handle icon generation in development mode
 * @param {IconifyPluginOptions} options - Plugin configuration
 */
export async function handleDevelopmentMode(options: IconifyPluginOptions) {
  try {
    const { bundleCode, listCode } = await generateDevIconListAndBundle(options)
    iconBundleCodeMap.set('default', bundleCode)
    iconListCodeMap.set('default', listCode)
  }
  catch (error) {
    console.error('[iconify-plugin] Failed to generate icons in dev mode:', error)
  }
}

/**
 * Handle hot update for icons
 * @param {HmrContext} ctx - HMR context
 * @param {() => IconifyPluginOptions} getCurrentOpts - Function to get current options
 * @returns {Promise<import('vite').ModuleNode[] | void>} Modules to update
 */
export async function handleHotUpdate(ctx: HmrContext, getCurrentOpts: () => IconifyPluginOptions) {
  const { file, server } = ctx
  const svgDirResolved = path.resolve(process.cwd(), getCurrentOpts().svgDir)

  const normFile = path.normalize(file)
  const normSvgDir = path.normalize(svgDirResolved)

  if (normFile.endsWith('.svg') && normFile.startsWith(normSvgDir)) {
    await handleDevelopmentMode(getCurrentOpts())

    const modList: import('vite').ModuleNode[] = []
    const modBundle = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ICON_BUNDLE)
    const modListMod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ICON_LIST)

    if (modBundle) {
      server.moduleGraph.invalidateModule(modBundle)
      modList.push(modBundle)
    }
    if (modListMod) {
      server.moduleGraph.invalidateModule(modListMod)
      modList.push(modListMod)
    }

    server.ws.send({ type: 'full-reload' })

    return modList
  }
}
