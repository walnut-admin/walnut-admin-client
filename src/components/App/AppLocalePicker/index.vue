<script lang="ts" setup>
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'

defineOptions({
  name: 'AppStoreLocalePicker',
})

const appStoreLocale = useAppStoreLocale()

onBeforeMount(() => {
  appStoreLocale.onGetLangList()
})
</script>

<template>
  <div>
    <n-popselect v-model:value="appStoreLocale.locale" :options="appStoreLocale.getLangList as SelectMixedOption[]">
      <WIcon icon="carbon:language" width="24" />
    </n-popselect>
  </div>
</template>
