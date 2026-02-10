<script lang="ts" setup>
import AccountSettingTabAccount from './tabs/account.vue'
import AccountSettingTabBasic from './tabs/basic.vue'
import AccountSettingTabPreference from './tabs/preference/index.vue'
import AccountSettingTabSecurity from './tabs/security/index.vue'

defineOptions({
  name: 'Me',
})

const activeTab = useRouterParam('tab', 'basic')
const child_tab = useRouterParam('child_tab')

const childTabMemory = new Map<string, string>()

function getDefaultChildTab(activeTabValue: string): string {
  const defaults: Record<string, string> = {
    basic: '1',
    security: '1',
    account: '1',
    prefer: '1',
  }
  return defaults[activeTabValue]
}

watch(() => activeTab.value, (newTab, oldTab) => {
  if (oldTab && child_tab.value) {
    childTabMemory.set(oldTab, child_tab.value)
  }

  if (newTab) {
    const saved = childTabMemory.get(newTab)

    if (saved) {
      child_tab.value = saved
    }
    else {
      const defaultValue = getDefaultChildTab(newTab)
      child_tab.value = defaultValue
      childTabMemory.set(newTab, defaultValue)
    }
  }
})
</script>

<template>
  <n-card :title="$t('sys.menu.account.setting')">
    <n-tabs v-model:value="activeTab" type="card" animated>
      <n-tab-pane name="basic" display-directive="show:lazy" :tab="$t('app.base.basic')">
        <AccountSettingTabBasic />
      </n-tab-pane>

      <n-tab-pane name="security" display-directive="show:lazy" :tab="$t('app.user.center.security')">
        <AccountSettingTabSecurity v-model:value="child_tab" />
      </n-tab-pane>

      <n-tab-pane name="account" display-directive="show:lazy" :tab="$t('app.user.center.account')">
        <AccountSettingTabAccount />
      </n-tab-pane>

      <n-tab-pane name="prefer" display-directive="show:lazy" :tab="$t('app.user.center.preference')">
        <AccountSettingTabPreference v-model:value="child_tab" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
