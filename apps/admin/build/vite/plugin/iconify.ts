import { IconifyPlugin } from './custom/iconify'

export function createIconifyPlugin() {
  return IconifyPlugin({
    online: true,
    treeshake: false,
    customPrefix: 'w-svg',
    sets: ['ant-design', 'mdi', 'simple-icons', 'carbon', 'emojione-v1'],
    scanPaths: ['src/**/*.{vue,ts,tsx}'],
    svgDir: '.svg',
  })
}
