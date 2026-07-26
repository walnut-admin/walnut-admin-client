import { homepage } from '~build/package'
// TODO 111
import WIcon from '@/components/UI/Icon'
import { getCookie, setCookie } from '@/utils/persistent/Cookie'
import { openExternalLink } from '@/utils/window/open'

export async function useStarOnGithub() {
  const { t } = useAppI18n()
  const appStoreSettingDev = useAppStoreSettingDev()
  const naiveStore = useAppStoreNaive()

  const dontShow = getCookie('dont-show-star')
  if (dontShow === true)
    return

  function onClick() {
    openExternalLink(homepage)
  }

  function onCheckboxChange(val: boolean) {
    setCookie('dont-show-star', val)
    if (val) {
      const timeId = setTimeout(async () => {
        await naiveStore.destroyCurrentNotiInst()
        clearTimeout(timeId)
      }, 1000)
    }
  }
  await naiveStore.destroyCurrentNotiInst()

  useAppNotiInfo('', {
    duration: 60 * 1000,
    description: t('app.github.desc'),
    containerStyle: {
      marginTop: `${appStoreSettingDev.getHeaderHeight}rem`,
    },
    content: () => {
      return (
        <n-space vertical size="small">
          <n-button text size="small" type="info" onClick={onClick}>
            <WIcon icon="ant-design:star-outlined" width="18"></WIcon>
            <span class="ml-1 font-semibold">{t('app.github.star')}</span>
          </n-button>

          <n-checkbox size="small" onUpdateChecked={onCheckboxChange}>{t('app.base.dontShowAgain')}</n-checkbox>
        </n-space>
      )
    },
  })
}
