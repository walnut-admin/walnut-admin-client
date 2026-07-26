<script lang="ts" setup>
defineOptions({
  name: 'DictDemo',
  defaultView: false,
})

const state = reactive({
  dict1: undefined,
  dict2: undefined,
  dict3: undefined,
  dict4: '0',
  dict5: ['1', '2'],
  dict6: 9,
  dict7: undefined,
  dict8: 'true',
  dict9: 'false',
})

const { loading: loading2, execDict: execDict2, dictData: dictData2 } = useDict('sys_shared_status')
const { loading, execDict, dictData } = useDict(['gbt_sex', 'sys_shared_status'])

const showHook = ref(true)
</script>

<template>
  <WDemoCard title="Dictionary">
    <n-switch v-model:value="showHook" class="mb-2" />

    <template v-if="showHook">
      <n-list>
        <n-list-item>
          <n-spin :show="loading2">
            <WJSON :value="dictData2" height="300px" />
          </n-spin>

          <WTitle
            class="mb-2"
            prefix="bar"
          >
            useDict hook single
          </WTitle>

          <n-button @click="execDict2">
            exec single
          </n-button>
        </n-list-item>

        <n-list-item>
          <n-spin :show="loading">
            <WJSON :value="dictData" height="300px" />
          </n-spin>

          <WTitle
            class="mb-2"
            prefix="bar"
          >
            useDict hook multiple
          </WTitle>

          <n-button @click="execDict">
            exec multiple
          </n-button>
        </n-list-item>
      </n-list>
    </template>

    <template v-else>
      <WJSON :value="state" height="300px" />

      <n-list>
        <n-list-item>
          <WTitle
            class="mb-2"
            prefix="bar"
            help-message="Highly packaged dict component, support render different component type"
          >
            Basic Usage
          </WTitle>

          <n-space vertical>
            <WDict v-model:value="state.dict1" dict-type="gbt_sex" />

            <WDict
              v-model:value="state.dict2"
              dict-type="gbt_sex"
              render-type="checkbox"
            />

            <WDict
              v-model:value="state.dict3"
              dict-type="gbt_sex"
              render-type="radio"
            />
          </n-space>
        </n-list-item>

        <n-list-item>
          <WTitle
            prefix="bar" class="mb-2"
          >
            Feedback
          </WTitle>

          <n-space vertical>
            <WDict v-model:value="state.dict4" dict-type="gbt_sex" />

            <WDict
              v-model:value="state.dict5"
              dict-type="gbt_sex"
              render-type="checkbox"
            />

            <WDict
              v-model:value="state.dict6"
              dict-type="gbt_sex"
              render-type="radio"
            />
          </n-space>
        </n-list-item>

        <n-list-item>
          <WTitle
            class="mb-2" prefix="bar"
          >
            Also support original component props
          </WTitle>

          <WDict
            v-model:value="state.dict7"
            dict-type="gbt_sex"
            :component-props="{
              multiple: true,
              clearable: true,
            }"
          />
        </n-list-item>

        <n-list-item>
          <WTitle
            class="mb-2" prefix="bar"
          >
            Handle boolean value
          </WTitle>

          <n-space vertical>
            <WDict
              v-model:value="state.dict8"
              dict-type="sys_shared_status"
              render-type="radio"
              :component-props="{ button: true, valueType: 'boolean' }"
            />

            <WDict
              v-model:value="state.dict9"
              dict-type="sys_shared_status"
              render-type="radio"
              :component-props="{ button: true, valueType: 'boolean' }"
            />
          </n-space>
        </n-list-item>
      </n-list>
    </template>
  </WDemoCard>
</template>
