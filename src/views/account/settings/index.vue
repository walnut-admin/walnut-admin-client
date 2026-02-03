<script lang="ts" setup>
import AccountSettingTabAccount from './tabs/account.vue'
import AccountSettingTabBasic from './tabs/basic.vue'
import AccountSettingTabPreference from './tabs/preference/index.vue'
import AccountSettingTabSecurity from './tabs/security/index.vue'

defineOptions({
  name: 'AccountSetting',
})

const activeTab = useRouterQuery('tab')
const child_tab = useRouterQuery('child_tab')

const childTabMemory = new Map<string, string>()

watch(() => activeTab.value, (newTab, oldTab) => {
  // 1. 保存旧大 Tab 的小 Tab 状态到内存
  if (oldTab && child_tab.value) {
    childTabMemory.set(oldTab, child_tab.value)
  }

  // 2. 恢复新大 Tab 的小 Tab 状态
  if (newTab) {
    // 🔥 修复：初始化时（oldTab 为 undefined），保留 URL 中的值
    if (oldTab === undefined) {
      // 刷新场景：将 URL 中的值保存到内存
      if (child_tab.value) {
        childTabMemory.set(newTab, child_tab.value)
      }
    }
    else {
      // 切换场景：从内存恢复或使用默认值
      child_tab.value = childTabMemory.get(newTab)
    }
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
