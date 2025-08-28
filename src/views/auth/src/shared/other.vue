<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'
import { getGiteeURIAPI, getGitHubURIAPI, getWeiboURIAPI } from '@/api/auth/third'
import { openOAuthWindow } from '@/utils/window/open'
import { useAuthContext } from '../hooks/useAuthContext'

defineOptions({
  name: 'SharedOtherWayToSignin',
  defaultView: false,
})

const { t } = useAppI18n()
const userStoreAuth = useAppStoreUserAuth()
const appStoreBackendSettings = useAppStoreSettingBackend()
const appStoreFingerprint = useAppStoreFingerprint()
const { loading } = useAuthContext()

let childWindow: Window | null

const iconArr = computed(() =>
  [
    {
      key: 'github',
      icon: 'ant-design:github-outlined',
      title: t('app.auth.other.github'),
      show: appStoreBackendSettings.getGitHubEnabled,
    },
    {
      key: 'gitee',
      icon: 'simple-icons:gitee',
      title: t('app.auth.other.gitee'),
      show: appStoreBackendSettings.getGiteeEnabled,
    },
  ].filter(i => i.show ?? true),
)

async function onOAuth(type: string) {
  loading.value = true

  const api: Recordable = {
    gitee: getGiteeURIAPI,
    github: getGitHubURIAPI,
    weibo: getWeiboURIAPI,
  }

  const res = await api[type]()

  childWindow = openOAuthWindow(res)!

  const { httpUrl } = useAppEnvProxy()

  const eventSource = new EventSource(
    `${httpUrl}/auth/oauth/${type}/sse/${appStoreFingerprint.getFingerprint}`,
    { withCredentials: true },
  )

  eventSource.onmessage = async ({ data }) => {
    const res = JSON.parse(data)

    if (res.event === `token:${type}`) {
      useAppMsgSuccess(t('app.oauth.success'))
      await userStoreAuth.ExcuteCoreFnAfterAuth(res.data.accessToken)
    }

    loading.value = false
    eventSource.close()
  }

  const id = setInterval(() => {
    if (childWindow && childWindow.closed) {
      loading.value = false
      eventSource.close()
      clearInterval(id)
    }
  }, 200)
}

async function onClick(key: string) {
  if (['wechat', 'alipay', 'qq'].includes(key)) {
    useAppMessage().warning(t('app.base.wip'))
    return
  }

  onOAuth(key)
}

useEventListener('beforeunload', () => {
  childWindow?.close()
})
onUnmounted(() => {
  childWindow?.close()
})
</script>

<template>
  <div>
    <WTransition appear group>
      <n-divider class="text-xs">
        {{ t('app.auth.other') }}
      </n-divider>

      <div class="w-full hstack justify-evenly children:cursor-pointer hover:children:text-primary">
        <span
          v-for="item in iconArr"
          :key="item.key"
          :title="item.title"
        >
          <WIconButton
            :button-props="{ text: true, disabled: loading, onClick: () => onClick(item.key) }"
            :icon-props="{ icon: item.icon, width: '20' }"
          />
        </span>
      </div>
    </WTransition>
  </div>
</template>

<style scoped>
.w-divider {
  margin: 12px 0 !important;
}
</style>
