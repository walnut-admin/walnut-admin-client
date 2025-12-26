<script lang="ts" setup>
import type { TabsInst } from 'naive-ui'

import SignInWitEmail from './common/email.vue'
import SignInWithOpaque from './common/opaque.vue'
import SignInWithQR from './common/QR.vue'

import SignInWitSMS from './common/SMS.vue'
import SharedOther from './shared/other.vue'

defineOptions({
  name: 'AuthSignin',
  defaultView: false,
})

const { t, locale } = useAppI18n()

const tabsInstRef = ref<TabsInst>()
const opaqueRef = useTemplateRef<{ setFormData: (n: string, p: string) => Record<string, never> }>('opaque')
const appStoreBackendSettings = useAppStoreSettingBackend()

watch(
  () => [locale, appStoreBackendSettings.auth],
  () => nextTick(() => tabsInstRef.value?.syncBarPosition()),
  {
    deep: true,
    immediate: true,
  },
)

defineExpose({
  setFormData: (n: string, p: string) => opaqueRef.value?.setFormData(n, p),
})
</script>

<template>
  <div class="w-full text-center">
    <n-tabs
      ref="tabsInstRef"
      :bar-width="28"
      animated
      default-value="opaque"
      pane-class="h-60"
      type="line"
      justify-content="space-around"
    >
      <n-tab-pane
        v-if="appStoreBackendSettings.getOpaqueEnabled"
        name="opaque"
        display-directive="show:lazy"
        :tab="t('form.app.auth.tab.account')"
      >
        <SignInWithOpaque
          ref="opaque"
          class="mt-2 w-72 text-justify"
        />
      </n-tab-pane>

      <n-tab-pane
        v-if="appStoreBackendSettings.getPhoneEnabled"
        name="SMS"
        display-directive="show:lazy"
        :tab="t('form.app.auth.tab.sms')"
      >
        <SignInWitSMS class="mt-2 w-72 text-justify" />
      </n-tab-pane>

      <n-tab-pane
        v-if="appStoreBackendSettings.getEmailEnabled"
        name="email"
        display-directive="show:lazy"
        :tab="t('form.app.auth.tab.email')"
      >
        <SignInWitEmail class="mt-2 w-72 text-justify" />
      </n-tab-pane>

      <n-tab-pane
        v-if="appStoreBackendSettings.getQrcodeEnabled"
        name="QR"
        display-directive="show:lazy"
        :tab="t('form.app.auth.tab.qr')"
      >
        <SignInWithQR class="mt-2 w-72 text-justify" />
      </n-tab-pane>
    </n-tabs>

    <SharedOther />
  </div>
</template>
