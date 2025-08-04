interface PackagedAuthor {
  name: string
  email: string
  url: string
}

interface PackagedUrls {
  doc: string
  demo: string
}

declare module '~build/package' {
  const name: string
  const version: string
  const author: PackagedAuthor
  const homepage: string

  const urls: PackagedUrls
  const dependencies: Record<string, string>
  const devDependencies: Record<string, string>
}
