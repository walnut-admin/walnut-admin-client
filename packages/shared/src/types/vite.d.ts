/// <reference types="vite/client" />

declare module '~build/package' {
  const name: string
  const version: string
  const homepage: string
  const dependencies: Record<string, string>
  const devDependencies: Record<string, string>

  const urls: {
    doc: string
    demo: string
  }
}
