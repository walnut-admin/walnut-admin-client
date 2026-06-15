<script lang="ts" setup>
defineOptions({
  name: 'MessageDemo',
  defaultView: false,
})
</script>

<template>
  <WDemoCard title="Basic help message">
    <n-space vertical>
      <WMessage msg="This is a help message." />

      <WMessage
        msg="This is a help message.
        Wrap by string."
      />

      <WMessage
        :msg="['This is a help message.', 'Wrap by array.']"
      />

      <WMessage msg="Change Icon" icon="ant-design:home-outlined" />

      <WMessage
        msg="All n-tooltip props will work."
        placement="right"
        :show-arrow="false"
        :delay="1000"
      />
    </n-space>
  </WDemoCard>
</template>
