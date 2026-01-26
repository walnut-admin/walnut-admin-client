<script lang="ts" setup>
import { securityCapApiEndpoint } from '@/api/security/cap'

defineOptions({
  name: 'WCompGlobalCap',
  inheritAttrs: false,
})

const closable = ref(false)

const compStoreCapJS = useStoreCompCapJS()

async function onCapSolve(e: { detail: { token: string } }) {
  const token = e.detail.token

  if (compStoreCapJS.onSuccess) {
    await compStoreCapJS.onSuccess!(token)
  }

  const id = setTimeout(() => {
    compStoreCapJS.onCloseCapModal()
    clearTimeout(id)
  }, 1000)
}

function onCapError() {
  closable.value = true
}
</script>

<template>
  <WModal
    v-model:show="compStoreCapJS.show"
    :close-on-esc="closable"
    :closable="closable"
    :mask-closable="closable"
    :default-button="false"
    :fullscreen="false"
    :title="$t('app.base.cap')"
    width="auto"
  >
    <n-element>
      <div
        style="
    --cap-background: var(--body-color);
    --cap-color: var(--text-color-1);
    --cap-border-color: var(--n-border-color);
    --cap-checkbox-border-radius: 6px;
    --cap-border-radius: var(--n-border-radius);
    --cap-checkbox-background: transparent;
    --cap-checkmark: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cstyle%3E%40keyframes%20anim%7B0%25%7Bstroke-dashoffset%3A23.21320343017578px%7Dto%7Bstroke-dashoffset%3A0%7D%7D%3C%2Fstyle%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m5%2012%205%205L20%207%22%20style%3D%22stroke-dashoffset%3A0%3Bstroke-dasharray%3A23.21320343017578px%3Banimation%3Aanim%20.5s%20ease%22%2F%3E%3C%2Fsvg%3E);
    --cap-spinner-color: var(--n-color);
    --cap-spinner-background-color: var(--n-text-color)"
      >
        <cap-widget
          :id="compStoreCapJS.getElementId"
          :data-cap-api-endpoint="securityCapApiEndpoint"
          :data-cap-i18n-verifying-label="$t('comp.cap.verifying')"
          :data-cap-i18n-initial-state="$t('comp.cap.initial')"
          :data-cap-i18n-solved-label="$t('comp.cap.solved')"
          :data-cap-i18n-error-label="$t('comp.cap.error')"
          @solve="onCapSolve"
          @error="onCapError"
        />
      </div>
    </n-element>
  </WModal>
</template>
