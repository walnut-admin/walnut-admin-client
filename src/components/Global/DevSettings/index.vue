<script lang="ts" setup>
import AppForm from './app.vue'
import BreadcrumbForm from './breadcrumb.vue'
import FooterForm from './footer.vue'
import HeaderForm from './header.vue'
import LogoForm from './logo.vue'
import MenuForm from './menu.vue'
import TabForm from './tab.vue'
import ThemesForm from './themes.vue'

defineOptions({
  name: 'WCompGlobalDevSettings',
})

const appStoreSettingDev = useAppStoreSettingDev()

const show = ref(false)

function onOpenSetting() {
  show.value = true
}

const { copy, copied } = useClipboard({
  source: computed(() =>
    JSON.stringify(
      {
        themes: appStoreSettingDev.themes,
        app: appStoreSettingDev.app,
        logo: appStoreSettingDev.logo,
        header: appStoreSettingDev.header,
        tabs: appStoreSettingDev.tabs,
        breadcrumb: appStoreSettingDev.breadcrumb,
        menu: appStoreSettingDev.menu,
        footer: appStoreSettingDev.footer,
      },
      null,
      4,
    ),
  ),
  copiedDuring: 8000,
})

function onReset() {
  window.location.reload()
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
      width="24rem"
      display-directive="show"
      :title="$t('app.settings.title')"
      :default-button="false"
      @yes="() => (show = false)"
      @no="() => (show = false)"
    >
      <ThemesForm />
      <AppForm />
      <LogoForm />
      <HeaderForm />
      <TabForm />
      <BreadcrumbForm />
      <MenuForm />
      <FooterForm />

      <template #footer>
        <div class="w-full">
          <n-button
            type="primary"
            class="w-full text-wrap"
            icon-placement="right"
            :disabled="copied"
            @click="copy()"
          >
            {{
              copied
                ? $t('app.settings.copy.helpMsg')
                : $t('app.settings.copy')
            }}
          </n-button>

          <n-button type="error" class="mt-2 w-full" @click="onReset">
            {{ $t('app.settings.reset') }}
          </n-button>
        </div>
      </template>
    </WDrawer>
  </div>
</template>
