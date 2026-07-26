<script lang="ts" setup>
defineOptions({
  name: 'Redirect',
})

const { currentRoute, replace } = useAppRouter()

const { params, query } = currentRoute.value
const { path } = params

const _path = Array.isArray(path) ? path.join('/') : path

replace({
  path: `/${_path}`,
  query,
})
</script>

<template>
  <div />
</template>

<style lang="scss" scoped></style>
