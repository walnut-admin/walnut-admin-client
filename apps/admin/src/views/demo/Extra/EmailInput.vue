<script lang="ts" setup>
defineOptions({
  name: 'EmailDemo',
  defaultView: false,
})

const state = ref({
  email1: '',
  email2: '674351624@qq.com',
  email3: '',
})
</script>

<template>
  <WDemoCard title="Email Input">
    <n-list>
      <WJSON :value="{ state }" height="200px" />

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Normal usage
        </WTitle>

        <WEmailInput v-model:value="state.email1" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Feedback
        </WTitle>

        <WEmailInput v-model:value="state.email2" />
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Disabled
        </WTitle>

        <WEmailInput v-model:value="state.email3" disabled />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>

<style lang="scss" scoped>

</style>
