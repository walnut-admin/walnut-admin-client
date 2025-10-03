<script lang="ts" setup>
import AccountSettingTabAccount from './tabs/account.vue'
import AccountSettingTabBasic from './tabs/basic.vue'
import AccountSettingTabPreference from './tabs/preference/index.vue'
import AccountSettingTabSecurity from './tabs/security.vue'

defineOptions({
  name: 'AccountSetting',
})

const activeTab = useRouterQuery('tab', 'info')
</script>

<template>
  <n-card :title="$t('sys.menu.account.setting')">
    <n-tabs v-model:value="activeTab" type="card" animated>
      <n-tab-pane name="info" display-directive="show:lazy" :tab="$t('app.base.basic')">
        <AccountSettingTabBasic />
      </n-tab-pane>

      <n-tab-pane name="security" display-directive="show:lazy" :tab="$t('app.user.center.security')">
        <AccountSettingTabSecurity />
      </n-tab-pane>

      <n-tab-pane name="account" display-directive="show:lazy" :tab="$t('app.user.center.account')">
        <AccountSettingTabAccount />
      </n-tab-pane>

      <n-tab-pane name="prefer" display-directive="show:lazy" :tab="$t('app.user.center.preference')">
        <AccountSettingTabPreference />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
