import type { GlobalThemeOverrides, ThemeCommonVars } from 'naive-ui'

import { adjustColor } from 'easy-fns-ts'
import { merge } from 'lodash-es'
import { darkTheme, lightTheme } from 'naive-ui'

const appStoreSettingDev = useAppStoreSettingDev()

export const getTheme = computed(() =>
  !isDark.value ? lightTheme : darkTheme,
)

const getThemeStyle = computed(() =>
  isDark.value ? appStoreSettingDev.getDarkThemes : appStoreSettingDev.getLightThemes,
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

// TODO need to fill it little by little
export const getThemeOverrides = computed(
  (): GlobalThemeOverrides => ({
    common: {
      fontSize: '1rem', // 14px = 1rem
      fontSizeMini: '0.8571rem', // 12px ÷ 14 ≈ 0.8571rem
      fontSizeTiny: '0.8571rem', // 12px ÷ 14 ≈ 0.8571rem
      fontSizeSmall: '1rem', // 14px = 1rem
      fontSizeMedium: '1rem', // 14px = 1rem
      fontSizeLarge: '1.0714rem', // 15px ÷ 14 ≈ 1.0714rem
      fontSizeHuge: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem

      // TODO height below would cause select height to be 0 in virtual scroll
      // heightMini: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      // heightTiny: '1.5714rem', // 22px ÷ 14 ≈ 1.5714rem
      // heightSmall: '2rem', // 28px ÷ 14 = 2rem
      // heightMedium: '2.4286rem', // 34px ÷ 14 ≈ 2.4286rem
      // heightLarge: '2.8571rem', // 40px ÷ 14 ≈ 2.8571rem
      // heightHuge: '3.2857rem', // 46px ÷ 14 ≈ 3.2857rem

      ...getThemeOverridesCommon.value,
    },

    Button: {
      paddingTiny: '0 0.4286rem', // 6px ÷ 14 ≈ 0.4286rem
      paddingSmall: '0 0.7143rem', // 10px ÷ 14 ≈ 0.7143rem
      paddingMedium: '0 1rem', // 14px = 1rem
      paddingLarge: '0 1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      paddingRoundTiny: '0 0.7143rem', // 10px ÷ 14 ≈ 0.7143rem
      paddingRoundSmall: '0 1rem', // 14px = 1rem
      paddingRoundMedium: '0 1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      paddingRoundLarge: '0 1.5714rem', // 22px ÷ 14 ≈ 1.5714rem
      iconMarginTiny: '0.4286rem', // 6px ÷ 14 ≈ 0.4286rem
      iconMarginSmall: '0.4286rem', // 6px ÷ 14 ≈ 0.4286rem
      iconMarginMedium: '0.4286rem', // 6px ÷ 14 ≈ 0.4286rem
      iconMarginLarge: '0.4286rem', // 6px ÷ 14 ≈ 0.4286rem
      iconSizeTiny: '1rem', // 14px = 1rem
      iconSizeSmall: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      iconSizeMedium: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      iconSizeLarge: '1.4286rem', // 20px ÷ 14 ≈ 1.4286rem
      heightMini: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      heightTiny: '1.5714rem', // 22px ÷ 14 ≈ 1.5714rem
      heightSmall: '2rem', // 28px ÷ 14 = 2rem
      heightMedium: '2.4286rem', // 34px ÷ 14 ≈ 2.4286rem
      heightLarge: '2.8571rem', // 40px ÷ 14 ≈ 2.8571rem
      heightHuge: '3.2857rem', // 46px ÷ 14 ≈ 3.2857rem
    },

    Input: {
      paddingTiny: '0 0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
      paddingSmall: '0 0.7143rem', // 10px ÷ 14 ≈ 0.7143rem
      paddingMedium: '0 0.8571rem', // 12px ÷ 14 ≈ 0.8571rem
      paddingLarge: '0 1rem', // 14px = 1rem
      clearSize: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
    },

    Tabs: {
      tabFontSizeSmall: '1rem', // 14px = 1rem
      tabFontSizeMedium: '1rem', // 14px = 1rem
      tabFontSizeLarge: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      tabGapSmallLine: '2.5714rem', // 36px ÷ 14 ≈ 2.5714rem
      tabGapMediumLine: '2.5714rem', // 36px ÷ 14 ≈ 2.5714rem
      tabGapLargeLine: '2.5714rem', // 36px ÷ 14 ≈ 2.5714rem
      tabGapSmallLineVertical: '0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
      tabGapMediumLineVertical: '0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
      tabGapLargeLineVertical: '0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
      tabPaddingSmallLine: '0.4286rem 0', // 6px ÷ 14 ≈ 0.4286rem
      tabPaddingMediumLine: '0.7143rem 0', // 10px ÷ 14 ≈ 0.7143rem
      tabPaddingLargeLine: '1rem 0', // 14px = 1rem
      tabPaddingVerticalSmallLine: '0.4286rem 0.8571rem', // 6px≈0.4286rem, 12px≈0.8571rem
      tabPaddingVerticalMediumLine: '0.5714rem 1.1429rem', // 8px≈0.5714rem, 16px≈1.1429rem
      tabPaddingVerticalLargeLine: '0.7143rem 1.4286rem', // 10px≈0.7143rem, 20px≈1.4286rem
      tabGapSmallBar: '2.5714rem', // 36px ÷ 14 ≈ 2.5714rem
      tabGapMediumBar: '2.5714rem', // 36px ÷ 14 ≈ 2.5714rem
      tabGapLargeBar: '2.5714rem', // 36px ÷ 14 ≈ 2.5714rem
      tabGapSmallBarVertical: '0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
      tabGapMediumBarVertical: '0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
      tabGapLargeBarVertical: '0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
      tabPaddingSmallBar: '0.2857rem 0', // 4px ÷ 14 ≈ 0.2857rem
      tabPaddingMediumBar: '0.4286rem 0', // 6px ÷ 14 ≈ 0.4286rem
      tabPaddingLargeBar: '0.7143rem 0', // 10px ÷ 14 ≈ 0.7143rem
      tabPaddingVerticalSmallBar: '0.4286rem 0.8571rem', // 6px≈0.4286rem, 12px≈0.8571rem
      tabPaddingVerticalMediumBar: '0.5714rem 1.1429rem', // 8px≈0.5714rem, 16px≈1.1429rem
      tabPaddingVerticalLargeBar: '0.7143rem 1.4286rem', // 10px≈0.7143rem, 20px≈1.4286rem
      tabGapSmallCard: '0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      tabGapMediumCard: '0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      tabGapLargeCard: '0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      tabGapSmallCardVertical: '0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      tabGapMediumCardVertical: '0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      tabGapLargeCardVertical: '0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      tabPaddingSmallCard: '0.5714rem 1.1429rem', // 8px≈0.5714rem, 16px≈1.1429rem
      tabPaddingMediumCard: '0.7143rem 1.4286rem', // 10px≈0.7143rem, 20px≈1.4286rem
      tabPaddingLargeCard: '0.8571rem 1.7143rem', // 12px≈0.8571rem, 24px≈1.7143rem
      tabPaddingSmallSegment: '0.2857rem 0', // 4px ÷ 14 ≈ 0.2857rem
      tabPaddingMediumSegment: '0.4286rem 0', // 6px ÷ 14 ≈ 0.4286rem
      tabPaddingLargeSegment: '0.5714rem 0', // 8px ÷ 14 ≈ 0.5714rem
      tabPaddingVerticalLargeSegment: '0 0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
      tabPaddingVerticalSmallCard: '0.5714rem 0.8571rem', // 8px≈0.5714rem, 12px≈0.8571rem
      tabPaddingVerticalMediumCard: '0.7143rem 1.1429rem', // 10px≈0.7143rem, 16px≈1.1429rem
      tabPaddingVerticalLargeCard: '0.8571rem 1.4286rem', // 12px≈0.8571rem, 20px≈1.4286rem
      tabPaddingVerticalSmallSegment: '0 0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      tabPaddingVerticalMediumSegment: '0 0.4286rem', // 6px ÷ 14 ≈ 0.4286rem
      panePaddingSmall: '0.5714rem 0 0 0', // 8px ÷ 14 ≈ 0.5714rem
      panePaddingMedium: '0.8571rem 0 0 0', // 12px ÷ 14 ≈ 0.8571rem
      panePaddingLarge: '1.1429rem 0 0 0', // 16px ÷ 14 ≈ 1.1429rem
      closeSize: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      closeIconSize: '1rem', // 14px = 1rem
    },

    Form: {
      feedbackPadding: '0.2857rem 0 0 0.1429rem', // 4px≈0.2857rem, 2px≈0.1429rem
      feedbackHeightSmall: '1.7143rem', // 24px≈1.7143rem
      feedbackHeightMedium: '1.7143rem', // 24px≈1.7143rem
      feedbackHeightLarge: '1.8571rem', // 26px≈1.8571rem
      feedbackFontSizeSmall: '0.9286rem', // 13px≈0.9286rem
      feedbackFontSizeMedium: '1rem', // 14px=1rem
      feedbackFontSizeLarge: '1rem', // 14px=1rem
      labelFontSizeLeftSmall: '1rem', // 14px=1rem
      labelFontSizeLeftMedium: '1rem', // 14px=1rem
      labelFontSizeLeftLarge: '1.0714rem', // 15px≈1.0714rem
      labelFontSizeTopSmall: '0.9286rem', // 13px≈0.9286rem
      labelFontSizeTopMedium: '1rem', // 14px=1rem
      labelFontSizeTopLarge: '1rem', // 14px=1rem
      labelHeightSmall: '1.7143rem', // 24px≈1.7143rem
      labelHeightMedium: '1.8571rem', // 26px≈1.8571rem
      labelHeightLarge: '2rem', // 28px=2rem
      labelPaddingVertical: '0 0 0.4286rem 0.1429rem', // 6px≈0.4286rem, 2px≈0.1429rem
      labelPaddingHorizontal: '0 0.8571rem 0 0', // 12px≈0.8571rem
    },

    Card: {
      paddingSmall: '0.8571rem 1.1429rem 0.8571rem', // 12px÷14≈0.8571rem, 16px÷14≈1.1429rem
      paddingMedium: '1.3571rem 1.7143rem 1.4286rem', // 19px÷14≈1.3571rem, 24px÷14≈1.7143rem, 20px÷14≈1.4286rem
      paddingLarge: '1.6429rem 2.2857rem 1.7143rem', // 23px÷14≈1.6429rem, 32px÷14≈2.2857rem, 24px÷14≈1.7143rem
      paddingHuge: '1.9286rem 2.8571rem 2rem', // 27px÷14≈1.9286rem, 40px÷14≈2.8571rem, 28px÷14=2rem
      titleFontSizeSmall: '1.1429rem', // 16px÷14≈1.1429rem
      titleFontSizeMedium: '1.2857rem', // 18px÷14≈1.2857rem
      titleFontSizeLarge: '1.2857rem', // 18px÷14≈1.2857rem
      titleFontSizeHuge: '1.2857rem', // 18px÷14≈1.2857rem
      closeIconSize: '1.2857rem', // 18px÷14≈1.2857rem
      closeSize: '1.5714rem', // 22px÷14≈1.5714rem
    },

    Switch: {
      buttonHeightSmall: '1rem', // 14px ÷ 14 = 1rem
      buttonHeightMedium: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      buttonHeightLarge: '1.5714rem', // 22px ÷ 14 ≈ 1.5714rem
      buttonWidthSmall: '1rem', // 14px ÷ 14 = 1rem
      buttonWidthMedium: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      buttonWidthLarge: '1.5714rem', // 22px ÷ 14 ≈ 1.5714rem
      buttonWidthPressedSmall: '1.4286rem', // 20px ÷ 14 ≈ 1.4286rem
      buttonWidthPressedMedium: '1.7143rem', // 24px ÷ 14 ≈ 1.7143rem
      buttonWidthPressedLarge: '2rem', // 28px ÷ 14 = 2rem
      railHeightSmall: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      railHeightMedium: '1.5714rem', // 22px ÷ 14 ≈ 1.5714rem
      railHeightLarge: '1.8571rem', // 26px ÷ 14 ≈ 1.8571rem
      railWidthSmall: '2.2857rem', // 32px ÷ 14 ≈ 2.2857rem
      railWidthMedium: '2.8571rem', // 40px ÷ 14 ≈ 2.8571rem
      railWidthLarge: '3.4286rem', // 48px ÷ 14 ≈ 3.4286rem
    },

    Checkbox: {
      sizeSmall: '1rem', // 14px = 1rem
      sizeMedium: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      sizeLarge: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      labelPadding: '0 0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
    },

    Radio: {
      radioSizeSmall: '1rem', // 14px = 1rem
      radioSizeMedium: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      radioSizeLarge: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      labelPadding: '0 0.5714rem', // 8px ÷ 14 ≈ 0.5714rem
    },

    Typography: {
      headerFontSize1: '2.1429rem', // 30px ÷ 14 ≈ 2.1429rem
      headerFontSize2: '1.5714rem', // 22px ÷ 14 ≈ 1.5714rem
      headerFontSize3: '1.2857rem', // 18px ÷ 14 ≈ 1.2857rem
      headerFontSize4: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      headerFontSize5: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      headerFontSize6: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      headerMargin1: '2rem 0 1.4286rem 0', // 28px=2rem, 20px≈1.4286rem
      headerMargin2: '2rem 0 1.4286rem 0', // 28px=2rem, 20px≈1.4286rem
      headerMargin3: '2rem 0 1.4286rem 0', // 28px=2rem, 20px≈1.4286rem
      headerMargin4: '2rem 0 1.2857rem 0', // 28px=2rem, 18px≈1.2857rem
      headerMargin5: '2rem 0 1.2857rem 0', // 28px=2rem, 18px≈1.2857rem
      headerMargin6: '2rem 0 1.2857rem 0', // 28px=2rem, 18px≈1.2857rem
      headerPrefixWidth1: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      headerPrefixWidth2: '1.1429rem', // 16px ÷ 14 ≈ 1.1429rem
      headerPrefixWidth3: '0.8571rem', // 12px ÷ 14 ≈ 0.8571rem
      headerPrefixWidth4: '0.8571rem', // 12px ÷ 14 ≈ 0.8571rem
      headerPrefixWidth5: '0.8571rem', // 12px ÷ 14 ≈ 0.8571rem
      headerPrefixWidth6: '0.8571rem', // 12px ÷ 14 ≈ 0.8571rem
      headerBarWidth1: '0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      headerBarWidth2: '0.2857rem', // 4px ÷ 14 ≈ 0.2857rem
      headerBarWidth3: '0.2143rem', // 3px ÷ 14 ≈ 0.2143rem
      headerBarWidth4: '0.2143rem', // 3px ÷ 14 ≈ 0.2143rem
      headerBarWidth5: '0.2143rem', // 3px ÷ 14 ≈ 0.2143rem
      headerBarWidth6: '0.2143rem', // 3px ÷ 14 ≈ 0.2143rem
      pMargin: '1.1429rem 0 1.1429rem 0', // 16px ÷ 14 ≈ 1.1429rem
    },

    Tree: {
      fontSize: '1rem', // 14px = 1rem
    },

    TreeSelect: {
      nodeHeight: '2.1429rem', // 30px ÷ 14 ≈ 2.1429rem
      nodeWrapperPadding: '0.2143rem 0', // 3px ÷ 14 ≈ 0.2143rem
    },

    Drawer: {
      bodyPadding: '1.1429rem 1.7143rem', // 16px ÷ 14 = 1.1429rem, 24px ÷ 14 = 1.7143rem
    },
  }),
)

export const getMergedTheme = computed(() =>
  merge(getTheme.value, getThemeOverrides.value),
)
