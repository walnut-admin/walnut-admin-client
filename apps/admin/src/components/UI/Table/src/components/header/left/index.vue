<script lang="ts" setup generic="T">
import TableHeaderLeftActions from './actions.vue'

defineOptions({
  name: 'WTableHeaderLeft',
})
</script>

<template>
  <div>
    <!-- @vue-generic {T} -->
    <TableHeaderLeftActions />
  </div>
</template>
