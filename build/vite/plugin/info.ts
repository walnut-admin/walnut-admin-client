import Info from 'unplugin-info/vite'

export function createInfoPlugin() {
  return Info({
    package: {
      name: true,
      version: true,
      author: true,
      homepage: true,
      urls: true,
      dependencies: true,
      devDependencies: true,
    },
  })
}
