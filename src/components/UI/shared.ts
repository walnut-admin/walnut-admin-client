export function isBaseI18nKey(key: string) {
  return i18nService.baseI18nKeyList?.some(i => i.endsWith(key))
}
