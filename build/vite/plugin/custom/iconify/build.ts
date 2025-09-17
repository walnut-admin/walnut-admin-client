import type { IconifyJSON } from '@iconify/types'
import type { PluginContext } from 'rollup'
import type { IconifyPluginOptions } from './types'

import { IconSet } from '@iconify/tools'
import { getIcons } from '@iconify/utils'
import { glob } from 'tinyglobby'
import { BuildUtilsReadFile } from '../../../../utils'
import { iconBundleCodeMap, iconListCodeMap } from './const'
import { buildTrie, IconLog, scanIcons } from './shared'
import { buildCustomSvgObject } from './svg'

interface ICustomSvg {
  customSvgObject: IconifyJSON
  customIcons: string[]
}

/**
 * Generate custom SVG icon data
 * @param {string} customPrefix - Prefix for custom icons
 * @returns {Promise<ICustomSvg>} Object containing custom SVG data and icon list
 */
async function generateBuildSvg(customPrefix: string): Promise<ICustomSvg> {
  const customSvgObject = await buildCustomSvgObject(customPrefix)
  const customIcons = Object.keys(customSvgObject.icons).map(i => `${customPrefix}:${i}`)
  IconLog(
    'Build Icon List Custom',
    `Getting custom svg icons: ${customIcons.length}`,
  )
  return { customSvgObject, customIcons }
}

/**
 * Get all icon lists when online && !treeshake in build mode
 * Unlike development environment which can read directly from node_modules,
 * here we need to read files and parse to generate icon string array,
 * then write to 'virtual:icon/list' for icon picker use
 * @param {IconifyPluginOptions} options - Plugin options
 * @param {string[]} customIcons - List of custom icons
 * @returns {Promise<string[]>} Array of icon strings, e.g. ['mdi:home','mdi:account']
 */
async function generateBuildIconListAll(options: IconifyPluginOptions, customIcons: string[]) {
  console.time('Build Icon List All')
  const { sets, customPrefix } = options

  let allIconsArray: string[] = [...customIcons]

  const builtInSet = [...sets]
  const idx = builtInSet.indexOf(customPrefix)
  if (idx > -1)
    builtInSet.splice(idx, 1)

  await Promise.all(
    builtInSet.map(async (i) => {
      const mod: { default: IconifyJSON } = await import(
        `@iconify/json/json/${i}.json`,
        { with: { type: 'json' } },
      )
      const fileJSON: IconifyJSON = mod.default

      const iconSet = new IconSet(fileJSON)

      const iconArr = iconSet.list().map(i => `${fileJSON.prefix}:${i}`)

      allIconsArray = allIconsArray.concat(iconArr)
    }),
  )

  IconLog(
    'Build Icon List Built-In',
    `Getting built-in json icons: ${allIconsArray.length - customIcons.length}`,
  )

  iconListCodeMap.set('default', `export default ${JSON.stringify(allIconsArray)}`)
  console.timeEnd('Build Icon List All')
  return allIconsArray
}

/**
 * Get all icons used in the project when online && treeshake in build mode
 * Scan all .vue, .ts, .tsx files in the project using tinyglobby,
 * then parse file content to extract all icon strings,
 * finally deduplicate and assign to listCodeCache
 * @param {IconifyPluginOptions} options - Plugin options
 * @param {string[]} customIcons - List of custom icons
 * @returns {Promise<string[]>} Array of used icon strings
 */
async function generateBuildIconListUsedInApp(options: IconifyPluginOptions, customIcons: string[]) {
  console.time('Build Icon List Used In App')
  const { scanPaths } = options

  let iconArr: string[] = []

  // Used in app
  const allIconsArray = await generateBuildIconListAll(options, customIcons)
  const files = await glob(scanPaths, { dot: true })
  IconLog(
    'Build Icon Used In App',
    `Scanning all 'vue, ts, tsx' files under 'src'. File number: ${files.length}`,
  )
  const buffers = await Promise.all(files.map(i => BuildUtilsReadFile(i)))

  const trie = buildTrie(allIconsArray)
  const usedIconsInAppSet = new Set<string>()
  for (const buf of buffers) {
    const icons = scanIcons(buf.toString(), trie)
    icons.forEach(i => usedIconsInAppSet.add(i))
  }

  const usedIconsInApp = Array.from(usedIconsInAppSet)

  IconLog(
    'Build Icon Used In App',
    `Detected ${usedIconsInApp.length} matched icons`,
  )

  iconArr = Array.from(new Set([...usedIconsInApp]))

  iconListCodeMap.set('default', `export default ${JSON.stringify(iconArr)}`)
  console.timeEnd('Build Icon List Used In App')
  return iconArr
}

/**
 * Custom svg needs to be added to bundle when online in build mode
 * Built-in icons don't need bundling because they are online
 * @param {IconifyJSON} customSvgObject - Custom SVG icon data
 */
async function generateBuildIconCustomBundle(customSvgObject: IconifyJSON) {
  iconBundleCodeMap.set('default', `import { addCollection } from '@iconify/vue';
addCollection(${JSON.stringify(customSvgObject)});`)

  IconLog(
    '[Online] Build Icon Svg JSON Bundle',
    `Bundled custom svg: ${Object.keys(customSvgObject.icons).length}`,
  )
}

/**
 * Generate official icon bundle
 * @param {string} customPrefix - Prefix for custom icons
 * @param {IconifyJSON} customSvgObject - Custom SVG icon data
 * @param {string[]} iconArr - Array of icon strings
 */
async function generateBuildIconOfficalBundle(customPrefix: string, customSvgObject: IconifyJSON, iconArr: string[]) {
  console.time('Build Icon Offical Bundle')
  // 1. Split icons
  const customNames: string[] = [] // Icon names without prefix
  const officialMap: Record<string, string[]> = Object.create(null) // prefix -> names

  iconArr.forEach((icon) => {
    const [prefix, name] = icon.split(':')
    if (!name)
      return // Fault tolerance
    if (prefix === customPrefix) {
      customNames.push(name)
    }
    else {
      ;(officialMap[prefix] ||= []).push(name)
    }
  })

  // 2. Generate custom icon set
  const customJson: IconifyJSON = customNames.length
    ? getIcons(customSvgObject, customNames) ?? { prefix: customPrefix, icons: {} }
    : { prefix: customPrefix, icons: {} }

  // 3. Generate official icon sets
  // Use dynamic import to read @iconify/json memory exports directly to avoid disk reading
  const officialJsons = await Promise.all(
    Object.entries(officialMap).map(async ([prefix, names]) => {
      // Official package exports IconifyJSON by default
      const mod: { default: IconifyJSON } = await import(
        `@iconify/json/json/${prefix}.json`,
        { with: { type: 'json' } },
      )
      const picked = getIcons(mod.default, names)
      return picked ?? { prefix, icons: {} }
    }),
  )

  // 4. Assemble bundle code
  const head = `import { addCollection } from '@iconify/vue';\n\n`

  const body: string[] = []
  // Add custom first
  if (Object.keys(customJson.icons).length) {
    body.push(`addCollection(${JSON.stringify(customJson)});`)
  }
  // Then add official
  officialJsons.forEach((json) => {
    if (Object.keys(json.icons).length) {
      body.push(`addCollection(${JSON.stringify(json)});`)
    }
  })

  iconBundleCodeMap.set('default', `${head + body.join('\n')}\n`)
  console.timeEnd('Build Icon Offical Bundle')
}

/**
 * Handle icon generation in production mode
 * @param {IconifyPluginOptions} options - Plugin configuration
 * @param {PluginContext} ctx - Plugin context
 */
export async function handleProductionMode(options: IconifyPluginOptions, ctx: PluginContext) {
  const { online, treeshake, customPrefix } = options

  if (!online && !treeshake) {
    ctx.error('Invalid configuration: online=false and treeshake=false is not allowed')
  }

  const { customIcons, customSvgObject } = await generateBuildSvg(customPrefix)

  if (online) {
    if (!treeshake) {
      await generateBuildIconListAll(options, customIcons)
    }
    else {
      await generateBuildIconListUsedInApp(options, customIcons)
    }

    await generateBuildIconCustomBundle(customSvgObject)
  }
  else {
    const usedIconArr = await generateBuildIconListUsedInApp(options, customIcons)
    await generateBuildIconOfficalBundle(customPrefix, customSvgObject, usedIconArr)
  }
}
