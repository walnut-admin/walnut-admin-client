import type { GlobalThemeOverrides, ThemeCommonVars } from 'naive-ui'

import { adjustColor } from 'easy-fns-ts'
import { merge } from 'lodash-es'
import { darkTheme, lightTheme } from 'naive-ui'

const appStoreSettings = useAppStoreSetting()

export const getTheme = computed(() =>
  !isDark.value ? lightTheme : darkTheme,
)

export const getThemeStyle = computed(() =>
  isDark.value ? appStoreSettings.themes.dark : appStoreSettings.themes.light,
)

export const getThemeOverridesCommon = computed(
  (): Partial<ThemeCommonVars> => ({
    primaryColor: getThemeStyle.value.primaryColor,
    primaryColorHover: adjustColor(getThemeStyle.value.primaryColor, 40),
    primaryColorPressed: adjustColor(getThemeStyle.value.primaryColor, 20),
    primaryColorSuppl: adjustColor(getThemeStyle.value.primaryColor, -20),
    infoColor: getThemeStyle.value.infoColor,
    infoColorHover: adjustColor(getThemeStyle.value.infoColor, 40),
    infoColorPressed: adjustColor(getThemeStyle.value.infoColor, 20),
    infoColorSuppl: adjustColor(getThemeStyle.value.infoColor, -20),
    successColor: getThemeStyle.value.successColor,
    successColorHover: adjustColor(getThemeStyle.value.successColor, 40),
    successColorPressed: adjustColor(getThemeStyle.value.successColor, 20),
    successColorSuppl: adjustColor(getThemeStyle.value.successColor, -20),
    warningColor: getThemeStyle.value.warningColor,
    warningColorHover: adjustColor(getThemeStyle.value.warningColor, 40),
    warningColorPressed: adjustColor(getThemeStyle.value.warningColor, 20),
    warningColorSuppl: adjustColor(getThemeStyle.value.warningColor, -20),
    errorColor: getThemeStyle.value.errorColor,
    errorColorHover: adjustColor(getThemeStyle.value.errorColor, 40),
    errorColorPressed: adjustColor(getThemeStyle.value.errorColor, 20),
    errorColorSuppl: adjustColor(getThemeStyle.value.errorColor, -20),

    bodyColor: getThemeStyle.value.bodyColor,
    invertedColor: getThemeStyle.value.invertedColor,
  }),
)

export const getThemeOverrides = computed(
  (): GlobalThemeOverrides => ({
    common: {
      ...getThemeOverridesCommon.value,
    },

    // change some default style here
    Dialog: {
      contentMargin: '8px 0',
    },
  }),
)

export const getMergedTheme = computed(() =>
  merge(getTheme.value, getThemeOverrides.value),
)
