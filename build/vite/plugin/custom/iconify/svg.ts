import type { IconifyJSON } from '@iconify/types'
import {
  cleanupSVG,
  importDirectory,
  parseColors,
  runSVGO,
} from '@iconify/tools'

/**
 * Build custom SVG icon object
 * @param {string} customPrefix - Prefix for custom icons
 * @param {string[]} [whiteList] - Optional whitelist of icon names
 * @returns {Promise<IconifyJSON>} IconifyJSON object containing custom icons
 */
export async function buildCustomSvgObject(customPrefix: string, whiteList?: string[]) {
  const iconSet = await importDirectory('.svg', { prefix: customPrefix })

  const icons: Record<string, { body: string }> = {}

  iconSet.forEach((name) => {
    if (whiteList && !whiteList.includes(name))
      return

    const svg = iconSet.toSVG(name)
    if (!svg)
      return

    try {
      cleanupSVG(svg)
      parseColors(svg, { defaultColor: 'currentColor' })
      runSVGO(svg)
    }
    catch {
      iconSet.remove(name)
      return
    }

    const body = svg.toMinifiedString()
      .replace(/\s*width\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\s*height\s*=\s*["'][^"']*["']/gi, '')

    icons[name] = { body }
  })

  return {
    prefix: customPrefix,
    icons,
  } as IconifyJSON
}
