<script lang="ts" setup>
defineOptions({
  name: 'ArrowDemo',
  defaultView: false,
})

const arrow = ref({ active: false, left: false, right: false })
</script>

<template>
  <WDemoCard title="Arrow">
    <n-form :model="arrow" inline label-placement="left" :label-width="60">
      <n-form-item label="Active" path="active">
        <n-switch v-model:value="arrow.active" />
      </n-form-item>

      <n-form-item label="Left" path="left">
        <n-switch v-model:value="arrow.left" />
      </n-form-item>

      <n-form-item label="Right" path="right">
        <n-switch v-model:value="arrow.right" />
      </n-form-item>
    </n-form>

    <WArrow
      :active="arrow.active"
      :left="arrow.left"
      :right="arrow.right"
      @click="arrow.active = !arrow.active"
    />
  </WDemoCard>
</template>
