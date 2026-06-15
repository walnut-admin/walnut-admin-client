import { watch } from 'vue'
import { isDark } from '@/hooks/app/useAppDark'

let cssLoaded = false
let darkLink: HTMLLinkElement | null = null
let lightLink: HTMLLinkElement | null = null

async function ensureCssLinks() {
  if (cssLoaded)
    return
  cssLoaded = true

  const [darkModule, lightModule] = await Promise.all([
    import('highlight.js/styles/github-dark.css?url'),
    import('highlight.js/styles/github.css?url'),
  ])

  darkLink = document.createElement('link')
  darkLink.rel = 'stylesheet'
  darkLink.href = darkModule.default
  darkLink.media = 'not all'
  document.head.appendChild(darkLink)

  lightLink = document.createElement('link')
  lightLink.rel = 'stylesheet'
  lightLink.href = lightModule.default
  lightLink.media = 'not all'
  document.head.appendChild(lightLink)
}

function setTheme(dark: boolean) {
  if (darkLink)
    darkLink.media = dark ? 'all' : 'not all'
  if (lightLink)
    lightLink.media = dark ? 'not all' : 'all'
}

export async function loadHighlightCss() {
  await ensureCssLinks()
  setTheme(isDark.value)
}

export function useHighlightTheme() {
  watch(isDark, (v) => {
    setTheme(v)
  })
}
