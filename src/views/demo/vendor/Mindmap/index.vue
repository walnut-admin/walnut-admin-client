<script lang="ts" setup>
import type { MindElixirData, Options } from 'mind-elixir'
import { getRandomInt } from 'easy-fns-ts'
import { homepage, urls } from '~build/package'

defineOptions({
  name: 'MindmapDemo',
})

const appStoreSettings = useAppStoreSetting()

const options: Omit<Options, 'el'> = {
  editable: true,
}

const data: MindElixirData = {
  nodeData: {
    id: 'root',
    topic: 'walnut-admin',
    children: [
      {
        id: `${getRandomInt(0, 999999)}`,
        topic: '前端',
        children: [
          {
            id: `${getRandomInt(0, 999999)}`,
            topic: `仓库地址：${homepage}`,
          },
          {
            id: `${getRandomInt(0, 999999)}`,
            topic: `预览地址：${urls.demo}`,
          },
          {
            id: `${getRandomInt(0, 999999)}`,
            topic: '所涉及的知识',
            children: [
              {
                id: `${getRandomInt(0, 999999)}`,
                topic: '基础',
                children: [
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'HTML',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'CSS',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'JS',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'TS',
                  },
                ],
              },
              {
                id: `${getRandomInt(0, 999999)}`,
                topic: '框架',
                children: [
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'Vue',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'Vue Router',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'Pinia',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'Vue I18n',
                  },
                ],
              },
              {
                id: `${getRandomInt(0, 999999)}`,
                topic: '工具库\n',
                children: [
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'vueuse',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'lodash-es',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'axios',
                  },
                ],
              },
              {
                id: `${getRandomInt(0, 999999)}`,
                topic: '第三方插件',
                children: [
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'echarts',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'cropperjs',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'tinymce',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'signature_pad',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'codemirror',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'intro.js',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'sortablejs',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'qrcode',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'crypto-js',
                  },
                ],
              },
              {
                id: `${getRandomInt(0, 999999)}`,
                topic: 'css',
                children: [
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'unocss',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'animate.css',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'hover.css',
                  },
                ],
              },
              {
                id: `${getRandomInt(0, 999999)}`,
                topic: 'socket',
                children: [
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'socket.io-client',
                  },
                ],
              },
              {
                id: `${getRandomInt(0, 999999)}`,
                topic: 'vite',
                children: [
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'plugin',
                    children: [
                      {
                        id: `${getRandomInt(0, 999999)}`,
                        topic: '基础插件',
                        children: [
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: '@vitejs/plugin-vue',
                          },
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: '@vitejs/plugin-vue-jsx',
                          },
                        ],
                      },
                      {
                        id: `${getRandomInt(0, 999999)}`,
                        topic: '开发插件',
                        children: [
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: 'vite-plugin-mkcert',
                          },
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: 'vite-plugin-restart',
                          },
                        ],
                      },
                      {
                        id: `${getRandomInt(0, 999999)}`,
                        topic: '通用插件',
                        children: [
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: 'unplugin-auto-import/vite',
                          },
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: 'unplugin-vue-components/vite',
                          },
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: 'unocss/vite',
                          },
                        ],
                      },
                      {
                        id: `${getRandomInt(0, 999999)}`,
                        topic: '打包插件',
                        children: [
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: 'rollup-plugin-visualizer',
                          },
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: '@vitejs/plugin-legacy',
                          },
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: 'vite-plugin-compression',
                          },
                          {
                            id: `${getRandomInt(0, 999999)}`,
                            topic: 'vite-plugin-banner',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'devServer',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'alias',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'env',
                  },
                  {
                    id: `${getRandomInt(0, 999999)}`,
                    topic: 'preview',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}
</script>

<template>
  <div>
    <WMindmap :data="data" :options="options" :style="{ width: appStoreSettings.getCalcContentWidthWithPadding, height: appStoreSettings.getCalcContentHeightWithPadding }" />
  </div>
</template>
