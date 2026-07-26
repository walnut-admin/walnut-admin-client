<script setup lang="ts">
defineOptions({
  name: 'AreaCascaderDemo',
  defaultView: false,
})

const appStoreSettingDev = useAppStoreSettingDev()

const values = ref({
  areaValue1: null,
  areaValue2: null,
  areaValue3: null,
  areaValue4: null,
  areaValue5: null,
  areaValue6: '23',
  areaValue7: '2301',
  areaValue8: '230103',
  areaValue9: '230103001',
  areaValue10: '230103001001',
  areaValue11: [],
  areaValue12: [],
  areaValue13: [],
  areaValue14: [],
  areaValue15: [],
  areaValue16: ['11', '12'],
  areaValue17: ['1301', '1401'],
  areaValue18: ['130102', '130202', '140105', '140106'],
  areaValue19: ['130102001', '130104001', '140105001', '140106001'],
  areaValue20: [
    '130102001001',
    '130102002010',
    '140105001001',
    '140105002001',
  ],
})
</script>

<template>
  <WDemoCard title="Area Cascader with endpoint support" :style="{ width: appStoreSettingDev.getCalcContentWidthWithPadding }">
    <WJSON :value="values" />

    <n-divider />
    <WTitle prefix="bar" class="mb-2">
      Base single cascader
    </WTitle>

    <n-space vertical>
      <WAreaCascader
        v-model:value="values.areaValue1"
        :depth="0"
      />

      <WAreaCascader
        v-model:value="values.areaValue2"
        :depth="1"
      />

      <WAreaCascader
        v-model:value="values.areaValue3"
        :depth="2"
      />

      <WAreaCascader
        v-model:value="values.areaValue4"
        :depth="3"
      />

      <WAreaCascader
        v-model:value="values.areaValue5"
        :depth="4"
      />
    </n-space>

    <n-divider />
    <WTitle prefix="bar" class="mb-2">
      Base Single feedback
    </WTitle>

    <n-space vertical>
      <WAreaCascader
        v-model:value="values.areaValue6"
        :depth="0"
      />

      <WAreaCascader
        v-model:value="values.areaValue7"
        :depth="1"
      />

      <WAreaCascader
        v-model:value="values.areaValue8"
        :depth="2"
      />

      <WAreaCascader
        v-model:value="values.areaValue9"
        :depth="3"
      />

      <WAreaCascader
        v-model:value="values.areaValue10"
        :depth="4"
      />
    </n-space>

    <n-divider />
    <WTitle prefix="bar" class="mb-2">
      Base multiple cascader
    </WTitle>

    <n-space vertical>
      <WAreaCascader
        v-model:value="values.areaValue11"
        multiple
        :depth="0"
      />

      <WAreaCascader
        v-model:value="values.areaValue12"
        multiple
        :depth="1"
      />

      <WAreaCascader
        v-model:value="values.areaValue13"
        multiple
        :depth="2"
      />

      <WAreaCascader
        v-model:value="values.areaValue14"
        multiple
        :depth="3"
      />

      <WAreaCascader
        v-model:value="values.areaValue15"
        multiple
        :depth="4"
      />
    </n-space>

    <n-divider />
    <WTitle prefix="bar" class="mb-2">
      Base multiple feedback
    </WTitle>

    <n-space vertical>
      <WAreaCascader
        v-model:value="values.areaValue16"
        multiple
        :depth="0"
      />

      <WAreaCascader
        v-model:value="values.areaValue17"
        multiple
        :depth="1"
      />

      <WAreaCascader
        v-model:value="values.areaValue18"
        multiple
        :depth="2"
      />

      <WAreaCascader
        v-model:value="values.areaValue19"
        multiple
        :depth="3"
      />

      <WAreaCascader
        v-model:value="values.areaValue20"
        multiple
        :depth="4"
      />
    </n-space>
  </WDemoCard>
</template>
