<script lang="ts" setup>
// This provider makes css vars like `var(--primary-color)` in naive
// Accessable through all app
// Class usage is achieved by windicss(now it's unocss), see more in unocss config
defineOptions({
  name: 'ThemeProvider',
})
</script>

<template>
  <n-element><slot /></n-element>
</template>
