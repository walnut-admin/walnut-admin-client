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
        'vue-router',
        'pinia',
        'naive-ui',
        'axios',
        'vue-i18n',
        '@vueuse/core',
        '@vueuse/integrations',
        '@vueuse/router',
        'socket.io-client',
        '@walnut/shared',
        '@walnut/axios',
      ],
    },
  },
})
