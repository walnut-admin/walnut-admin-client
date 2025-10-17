<script lang="ts" setup>
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'

defineOptions({
  name: 'AppStoreLocalePicker',
})

const appStoreLocale = useAppStoreLocale()

onBeforeMount(() => {
  appStoreLocale.onGetLangListPublic()
})
</script>

<template>
  <n-popselect :value="appStoreLocale.locale" :options="appStoreLocale.getLangList as SelectMixedOption[]" @update:value="appStoreLocale.onLoadMessageCache">
    <WIcon icon="carbon:language" width="28" />
  </n-popselect>
</template>
