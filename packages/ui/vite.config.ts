import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), vueJsx(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'pinia',
        'naive-ui',
        'vue-i18n',
        '@vueuse/core',
        'lodash-es',
        'echarts',
        'highlight.js',
        'markdown-it',
        'cropperjs',
        'driver.js',
        'sortablejs',
        'compare-versions',
        '@walnut/shared',
        '@walnut/core',
      ],
    },
  },
})
