import { useAppColorMode } from './useAppColorMode'
import { useAppDark } from './useAppDark'
import { useAppFontSize } from './useAppFontSize'
import { useAppLocale } from './useAppLocale'
import { useAppReducedMotion } from './useAppReducedMotion'

export function useAppHooks() {
  // regular title
  useAppTitle()
  // regulat resize
  useAppResize()

  // app locale, relative to user preference
  useAppLocale()
  // app color mode, relative to user preference
  useAppColorMode()
  // app reduced motion, relative to user preference
  useAppReducedMotion()
  // app dark mode, relative to user preference
  useAppDark()
  // app font size, relative to user preference
  useAppFontSize()

  // custom user monitor based on sendBeacon
  useAppUserMonitor()
}
