import type { App } from 'vue'
import type { I18n, Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'

const appStoreLocale = useAppStoreLocale()

const i18n = createI18n({
  legacy: false,
  locale: appStoreLocale.getLocale,
  messages: {},
})

export function setupI18n(app: App) {
  app.use(i18n)
}

export const AppI18n = (): I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, Locale, false> => i18n

export const useAppI18n = () => useI18n()
