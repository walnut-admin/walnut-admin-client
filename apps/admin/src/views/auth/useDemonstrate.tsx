export function useDemonstrate() {
  const { t } = useAppI18n()
  const naiveStore = useAppStoreNaive()
  const signInRef = useTemplateRef<{ setFormData: (n: string, p: string) => void }>('signInRef')

  const formData = {
    account: 'visitor',
    password: '2020abcd',
  }

  function onClick() {
    signInRef.value?.setFormData(formData.account, formData.password)
  }

  useAppNotiInfo('', {
    duration: 60000,
    title: t('app.base.demonstrate'),
    keepAliveOnHover: true,
    content: () => {
      return (
        <n-space vertical size="small">
          <div>
            {t('app.base.account')}
            :
            {' '}
            {formData.account}
          </div>
          <div>
            {(t('app.base.password'))}
            :
            {' '}
            {formData.password}
          </div>
          <n-button size="small" type="info" onClick={onClick}>
            {t('app.base.fillForm')}
          </n-button>
        </n-space>
      )
    },
  })

  tryOnUnmounted(() => {
    naiveStore.destroyCurrentNotiInst()
  })

  return { signInRef }
}
