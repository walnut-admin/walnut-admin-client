import type { Plugin } from 'vite'

export function createDisableDevtoolPlugin(): Plugin {
  return {
    name: 'vite-plugin-disable-devtool-cdn',
    enforce: 'pre',

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const scriptTag = `<script disable-devtool-auto src="https://cdn.jsdelivr.net/npm/disable-devtool"></script>`
        html = html.replace(/<\/head>/, `${scriptTag}\n</head>`)
        return html
      },
    },
  }
}
