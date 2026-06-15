import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export function createImageOptimizerPlugin() {
  return ViteImageOptimizer({
    test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
    exclude: undefined,
    include: undefined,
    includePublic: true,
    logStats: true,
    ansiColors: true,
    svg: {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupNumericValues: false,
              // `removeViewBox` is no longer part of preset-default in SVGO v3+,
              // so it won't be applied. Configure it separately if needed.
            },
          },
        },
        'sortAttrs',
        {
          name: 'addAttributesToSVGElement',
          params: {
            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
          },
        },
      ],
    },
    png: {
    // https://sharp.pixelplumbing.com/api-output#png
      quality: 50,
    },
    jpeg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
      quality: 50,
    },
    jpg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
      quality: 50,
    },
    tiff: {
    // https://sharp.pixelplumbing.com/api-output#tiff
      quality: 50,
    },
    // gif does not support lossless compression
    // https://sharp.pixelplumbing.com/api-output#gif
    gif: {},
    webp: {
    // https://sharp.pixelplumbing.com/api-output#webp
      lossless: true,
    },
    avif: {
    // https://sharp.pixelplumbing.com/api-output#avif
      lossless: true,
    },
    cache: false,
    cacheLocation: undefined,
  })
}
