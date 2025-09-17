import type { IconifyPluginOptions } from './types'

export const iconSVGJSONPath = 'build/_generated/svg.json'
export const iconListPath = 'build/_generated/icon-list.ts'
export const iconBundlePath = 'build/_generated/icon-bundle.ts'

export const VIRTUAL_MODULE_ICON_LIST = 'virtual:icon/list'
export const RESOLVED_VIRTUAL_MODULE_ICON_LIST = `\0${VIRTUAL_MODULE_ICON_LIST}`
export const VIRTUAL_MODULE_ICON_SET = 'virtual:icon/set'
export const RESOLVED_VIRTUAL_MODULE_ICON_SET = `\0${VIRTUAL_MODULE_ICON_SET}`
export const VIRTUAL_MODULE_ICON_BUNDLE = 'virtual:icon/bundle'
export const RESOLVED_VIRTUAL_MODULE_ICON_BUNDLE = `\0${VIRTUAL_MODULE_ICON_BUNDLE}`

export const DEFAULT_ICONIFY_OPTIONS: IconifyPluginOptions = {
  online: true,
  treeshake: false,
  customPrefix: 'w-svg',
  sets: ['ant-design', 'mdi', 'simple-icons', 'carbon', 'emojione-v1'],
  scanPaths: ['src/**/*.{vue,ts,tsx}'],
  svgDir: '.svg',
}

export const iconListCodeMap = new Map<string, string>()
export const iconBundleCodeMap = new Map<string, string>()
