import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['apps/admin/.agents/**/*', 'AGENTS.md', 'TODO.md', 'apps/admin/src/**/*.md', '**/dist/**'],
    unocss: true,
    rules: {
      // LINK reasonable https://stackoverflow.com/a/78566802
      'ts/no-namespace': 'off',
      'no-console': 'off',
      'regexp/no-unused-capturing-group': 'off',
    },
  },
)
