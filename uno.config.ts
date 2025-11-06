import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [['hstack', 'flex flex-row flex-nowrap'], ['vstack', 'flex flex-col flex-nowrap']],

  theme: {
    colors: {
      // extend from naive-ui color
      primary: 'var(--primary-color)',
      primaryHover: 'var(--primary-color-hover)',

      info: 'var(--info-color)',
      infoHover: 'var(--info-color-hover)',

      warning: 'var(--warning-color)',
      warningHover: 'var(--warning-color-hover)',

      error: 'var(--error-color)',
      errorHover: 'var(--error-color-hover)',

      bodyColor: 'var(--body-color)',
      bodyHover: 'var(--body-color-hover)',
    },

    animation: {
      keyframes: {
        'hue-rotate': '{ 100% { filter: contrast(15) hue-rotate(360deg) } }',
        'wave-circle': '{ 0% { transform: translate(-50%, -50%); } 50% { border-radius: 45% / 42% 38% 58% 49%; } 100% { transform: translate(-50%, -50%) rotate(720deg); } }',
      },

      durations: {
        'hue-rotate': '10s',
        'wave-circle': '10s',
      },

      counts: {
        'hue-rotate': 'infinite',
        'wave-circle': 'infinite',
      },
    },
  },

  presets: [
    presetWind3({
      dark: 'class',
    }),
    presetAttributify({ prefix: 'w:' }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})
