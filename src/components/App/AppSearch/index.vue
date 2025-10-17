<script lang="ts" setup>
defineOptions({
  name: 'AppSearch',
})

const { t } = useAppI18n()

function onClick() {
  useAppMsgInfo(t('app.base.wip'))
}
</script>

<template>
  <WIcon icon="mdi:feature-search-outline" height="28" @click="onClick" />
</template>
