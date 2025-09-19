<script lang="ts" setup>
import AppForm from './app.vue'
import BreadcrumbForm from './breadcrumb.vue'
import FooterForm from './footer.vue'
import HeaderForm from './header.vue'
import LogoForm from './logo.vue'
import MenuForm from './menu.vue'
import TabForm from './tab.vue'

defineOptions({
  name: 'WCompGlobalDevSettings',
})

const show = ref(false)

function onOpenSetting() {
  show.value = true
}
</script>

<template>
  <div>
    <WIcon
      id="walnut-admin-dev-settings"
      height="24"
      icon="mdi:developer-board"
      @click="onOpenSetting"
    />

    <WDrawer
      v-model:show="show"
      :width="350"
      display-directive="show"
      :default-button="false"
      @yes="() => (show = false)"
      @no="() => (show = false)"
    >
      <AppForm />
      <LogoForm />
      <HeaderForm />
      <TabForm />
      <BreadcrumbForm />
      <MenuForm />
      <FooterForm />
    </WDrawer>
  </div>
</template>
