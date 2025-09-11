<script lang="ts" setup>
import type { SelectBaseOption } from 'naive-ui/lib/select/src/interface'
import { AppI18nGetLangLists } from '@/api/system/lang'

defineOptions({
  name: 'AppStoreLocalePicker',
})

const appStoreLocale = useAppStoreLocale()

const langLists = ref<SelectBaseOption[]>([])

async function onGetLangList() {
  const res = await AppI18nGetLangLists()
  langLists.value = res
}

onBeforeMount(() => {
  onGetLangList()
})
</script>

<template>
  <div>
    <n-popselect v-model:value="appStoreLocale.locale" :options="langLists">
      <WIcon icon="carbon:language" width="24" />
    </n-popselect>
  </div>
</template>
