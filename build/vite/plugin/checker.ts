import checker from 'vite-plugin-checker'

export function createCheckerPlugin() {
  return checker({
    typescript: true,
    vueTsc: true,
    eslint: {
      lintCommand: 'eslint .',
      useFlatConfig: true,
      watchPath: '../../../src',
    },
  })
}
