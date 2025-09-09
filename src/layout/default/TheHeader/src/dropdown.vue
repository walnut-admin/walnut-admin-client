<script lang="tsx" setup>
import type { DropdownMixedOption } from 'naive-ui/lib/dropdown/src/interface'

import { homepage, urls } from '~build/package'

// TODO 111
import WIcon from '@/components/UI/Icon'
import { openExternalLink } from '@/utils/window/open'
import WAvatar from '@/views/account/settings/components/avatar.vue'
import SwitchRole from './switchRole.vue'

const { t } = useAppI18n()
const userStoreProfile = useAppStoreUserProfile()
const userStoreAuth = useAppStoreUserAuth()

const switchRoleRef = useTemplateRef('switchRoleRef')

const dropdownOptions = computed<DropdownMixedOption[]>(() => [
  {
    key: '1',
    label: t('desc.about.info.doc'),
    icon: () => <WIcon icon="mdi:file-document"></WIcon>,
  },

  {
    key: '2',
    label: t('desc.about.info.code'),
    icon: () => <WIcon icon="ant-design:github-outlined"></WIcon>,
  },

  {
    key: '3',
    label: t('app.base.switchRole'),
    icon: () => <WIcon icon="ant-design:github-outlined"></WIcon>,
    show: userStoreProfile.getCurrentRoleModeIsSwitchable,
  },

  {
    type: 'divider',
  },

  {
    key: '98',
    label: t('app.user.center'),
    icon: () => <WIcon icon="ant-design:profile-outlined"></WIcon>,
  },
  {
    key: '99',
    label: t('app.user.signout'),
    icon: () => <WIcon icon="ant-design:logout-outlined"></WIcon>,
  },
])

async function onSelect(val: string) {
  if (val === '1')
    openExternalLink(urls.doc)

  if (val === '2')
    openExternalLink(homepage)

  if (val === '3')
    switchRoleRef.value?.onOpen()

  if (val === '98')
    await useAppRouterPush({ name: 'AccountSetting' })

  if (val === '99') {
    const { confirmed } = await useAppConfirm(t('app.user.signout.warning'))

    if (confirmed)
      await userStoreAuth.Signout()
  }
}
</script>

<template>
  <n-dropdown
    trigger="hover"
    size="medium"
    :options="dropdownOptions"
    @select="onSelect"
  >
    <div class="hstack items-center justify-center">
      <div style="height: 32px; width: 32px">
        <WAvatar
          v-if="$route.name !== 'AccountSetting'"
          :size="32"
        />
      </div>

      <div class="my-auto pl-1 text-base font-semibold">
        {{ userStoreProfile.getDisplayName }}
      </div>
    </div>
  </n-dropdown>

  <SwitchRole ref="switchRoleRef" />
</template>
