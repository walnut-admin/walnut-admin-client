<script lang="ts" setup>
import AccountSettingTabAccount from './tabs/account.vue'
import AccountSettingTabBasic from './tabs/basic.vue'
import AccountSettingTabPreference from './tabs/preference/index.vue'
import AccountSettingTabSecurity from './tabs/security/index.vue'

defineOptions({
  name: 'AccountSetting',
})

const activeTab = useRouterQuery('tab', 'info')
const child_tab = useRouterQuery('child_tab', '1')

// 🔥 用 Map 存储每个大 Tab 的小 Tab 状态
const childTabMemory = new Map<string, string>([
  ['security', '1'],
  ['prefer', '1'],
])

// 切换大 Tab 时:保存当前小 Tab 状态 → 恢复新大 Tab 的小 Tab 状态
watch(() => activeTab.value, (newTab, oldTab) => {
  // 1. 保存旧大 Tab 的小 Tab 状态到内存
  if (oldTab && child_tab.value) {
    childTabMemory.set(oldTab, child_tab.value)
  }

  // 2. 恢复新大 Tab 的小 Tab 状态到 URL
  if (newTab) {
    child_tab.value = childTabMemory.get(newTab) || '1'
  }
}, { immediate: true })

// 小 Tab 变化时同步到内存
watch(() => child_tab.value, (val) => {
  if (activeTab.value && val) {
    childTabMemory.set(activeTab.value, val)
  }
})
</script>

<template>
  <n-card :title="$t('sys.menu.account.setting')">
    <n-tabs v-model:value="activeTab" type="card" animated>
      <n-tab-pane name="info" display-directive="show:lazy" :tab="$t('app.base.basic')">
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
