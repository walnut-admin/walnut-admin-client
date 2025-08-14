import AutoImport from 'unplugin-auto-import/vite'

export function creatAutoImportPlugin() {
  return AutoImport({
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],

    dts: 'types/auto-import.d.ts',

    // Auto import for module exports under directories
    // by default it only scan one level of modules under the directory
    dirs: [
      'src/const/**',
      'src/locales/**',
      'src/router',
      'src/store/modules/**',
      'src/hooks/**',
      'src/socket/**',
    ],

    vueTemplate: true,

    imports: [
      // presets
      'vue',
      'vue-router',
      'vue-i18n',
      '@vueuse/core',

      // custom
      {
        '@/components/UI/Form': ['useForm'],
        '@/components/UI/Table': ['useTable'],
        '@/components/Advanced/CRUD': ['useCRUD'],

        // table preset columns
        '@/components/UI/Table/src/utils/presetColumns': [
          'WTablePresetOrderColumn',
          'WTablePresetStatusColumn',
          'WTablePresetCreatedAtColumn',
          'WTablePresetUpdatedAtColumn',
        ],
      },
    ],
  })
}
