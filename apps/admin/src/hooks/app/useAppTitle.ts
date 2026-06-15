/**
 * @description reactive document title
 */
export function useAppTitle() {
  const title = useTitle()

  const isVisible = useSharedDocumentVisibility()
  const { t, locale } = useAppI18n()
  const { currentRoute } = useAppRouter()
  const { title: envTitle } = useAppEnvTitle()

  watch(
    () => [currentRoute.value.path, locale, isVisible] as const,
    ([_, __, visible]) => {
      try {
        if (!visible.value) {
          title.value = t('app.title')
        }
        else {
          const translateTitle = t(currentRoute.value.meta.title as string)
          title.value = `${translateTitle} - ${envTitle}`
        }
      }
      catch {
        title.value = `${envTitle}`
      }
    },
    {
      deep: true,
      immediate: true,
    },
  )
}
