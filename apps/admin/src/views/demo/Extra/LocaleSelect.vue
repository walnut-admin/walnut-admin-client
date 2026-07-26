<script lang="ts" setup>
defineOptions({
  name: 'LocaleSelectDemo',
  defaultView: false,
})

const state = reactive({
  locale1: '',
  locale2: 'app.base.yes',
  locale3: '',
  locale4: 'sys.menu.homepage',
  locale5: '',
})
</script>

<template>
  <WDemoCard title="Locale Select">
    <WJSON :value="state" height="200px" />

    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic usage
        </WTitle>

        <n-space vertical>
          <WLocaleSelect
            v-model:value="state.locale1"
            class="w-96"
          />
          <WLocaleSelect
            v-model:value="state.locale2"
            class="w-96"
          />
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          With prefix limit
        </WTitle>

        <n-space vertical>
          <WLocaleSelect
            v-model:value="state.locale3"
            class="w-96"
            prefix="sys.menu."
          />

          <WLocaleSelect
            v-model:value="state.locale4"
            class="w-96"
            prefix="sys.menu."
          />
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Jump to locale manage page with a preset key
        </WTitle>

        <n-space vertical>
          <WLocaleSelect
            v-model:value="state.locale5"
            class="w-96"
            preset-key="sys.menu."
          />
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
