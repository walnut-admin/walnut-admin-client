<script lang="ts" setup generic="T">
import TableHeaderLeft from './left/index.vue'
import TableHeaderRight from './right/index.vue'
</script>

<template>
  <div class="mb-2 flex items-center justify-between">
    <!-- @vue-generic {T} -->
    <TableHeaderLeft />
    <!-- @vue-generic {T} -->
    <TableHeaderRight />
  </div>
</template>

<style lang="scss" scoped></style>
