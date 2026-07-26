import type { ComponentResolver } from 'unplugin-vue-components/types'
import { globSync } from 'tinyglobby'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

function WalnutAdminComponentResolver(): ComponentResolver {
  const allComponents = globSync('src/components/**/**/index.ts', { dot: true })
  const componentMap = Object.fromEntries(allComponents.filter(i => !i.includes('utils')).map(i => [i.split('/').slice(-2, -1)[0], i.replace('src', '@')]))

  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith('W')) {
        const componentName = name.slice(1)

        if (componentMap[componentName]) {
          return componentMap[componentName]
        }
      }
    },
  }
}

export function createComponentPlugin() {
  return Components({
    dirs: ['@/components'],

    extensions: ['vue', 'ts', 'tsx'],

    // allow auto import and register components used in markdown
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],

    dts: 'types/components.d.ts',

    deep: false,

    resolvers: [
      // Naive
      NaiveUiResolver(),

      // Custom
      WalnutAdminComponentResolver(),
    ],
  })
}
