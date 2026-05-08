import checker from 'vite-plugin-checker'

export function createCheckerPlugin() {
  return checker({
    typescript: true,
    vueTsc: true,
    eslint: {
      lintCommand: 'eslint . --ignore-pattern "*.md"',
      useFlatConfig: true,
      watchPath: '../../../src',
    },
  })
}
