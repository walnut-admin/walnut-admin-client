<script lang="ts" setup>
import {
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification,
} from 'naive-ui'

defineOptions({
  name: 'MsgProvider',
})

window.$loadingBar = useLoadingBar()
window.$message = useMessage()
window.$notification = useNotification()
window.$dialog = useDialog()
</script>

<template>
  <slot />
</template>
