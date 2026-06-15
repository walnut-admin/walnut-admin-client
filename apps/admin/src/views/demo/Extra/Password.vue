<script lang="ts" setup>
defineOptions({
  name: 'PasswordDemo',
  defaultView: false,
})

const state = ref({
  password1: '',
  password2: '',
  capslock: false,
  progress: false,
})
</script>

<template>
  <WDemoCard title="Password Input">
    <WJSON :value="state" height="200px" />

    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic usage
        </WTitle>

        <n-space vertical>
          <WPassword v-model:value="state.password1" />
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Progress and Capslock support
        </WTitle>

        <n-space vertical>
          <n-switch v-model:value="state.capslock">
            <template #checked>
              capslock tooltip
            </template>
            <template #unchecked>
              capslock tooltip
            </template>
          </n-switch>
          <n-switch v-model:value="state.progress">
            <template #checked>
              progress bar
            </template>
            <template #unchecked>
              progress bar
            </template>
          </n-switch>

          <WPassword
            v-model:value="state.password2"
            :capslock="state.capslock"
            :progress="state.progress"
          />
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
