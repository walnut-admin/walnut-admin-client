import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        'lodash-es',
        'nanoid',
        'idb',
        'superjson',
        'js-base64',
        'detectincognitojs',
        '@vueuse/core',
        '~build/package',
      ],
    },
  },
})
