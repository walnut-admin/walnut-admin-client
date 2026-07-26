import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        'naive-ui',
        'vue-i18n',
        '@vueuse/core',
        'highlight.js',
        'markdown-it',
        '@walnut/shared',
        '@walnut/axios',
        '@walnut/core',
        '@walnut/ui',
      ],
    },
  },
})
