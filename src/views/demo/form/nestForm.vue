<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'
import { objectToPaths, pathsToObject } from '@/utils/shared'

defineOptions({
  name: 'NestForm',
  defaultView: false,
})

const objectFormData = ref<Recordable>({
  nested: [
    {
      input1: '1',
    },
    {
      input2: '2',
    },
    {
      input: [
        [
          '3',
          '4',
        ],
      ],
    },
  ],
  a: {
    b: {
      c: {
        input1: '5',
        input2: '6',
      },
    },
  },
})

const getPath = computed(() => objectToPaths(objectFormData.value))

const [registerObject] = useForm<typeof objectFormData.value>({
  labelWidth: 80,
  schemas: [
    ...Array.from({ length: 2 }, (v, k) => {
      return {
        type: 'Base:Input',
        formProp: {
          label: `Input ${k + 1}`,
          path: `nested[${k}].input${k + 1}`,
          rule: {
            required: true,
            trigger: 'change',
          },
        },
      }
    }),
    ...Array.from({ length: 2 }, (v, k) => {
      return {
        type: 'Base:Input',
        formProp: {
          label: `Input ${k + 1}`,
          path: `nested[2].input[0][${k}]`,
          rule: {
            required: true,
            trigger: 'change',
          },
        },
      }
    }),
    ...Array.from({ length: 2 }, (v, k) => {
      return {
        type: 'Base:Input',
        formProp: {
          label: `Input ${k + 1}`,
          path: `a.b.c.input${k + 1}`,
          rule: {
            required: true,
            trigger: 'change',
          },
        },
      }
    }),
  ],
})

const pathFormData = ref<Recordable>({
  'nested[0].input1': '1',
  'nested[1].input2': '2',
  'nested[2].input[0][0]': '3',
  'nested[2].input[0][1]': '4',
  'a.b.c.input1': '5',
  'a.b.c.input2': '6',
})

const getObject = computed(() => pathsToObject(pathFormData.value))

const [registerPath] = useForm<typeof pathFormData.value>({
  labelWidth: 80,
  schemas: [
    ...Array.from({ length: 2 }, (v, k) => {
      return {
        type: 'Base:Input',
        formProp: {
          label: `Input ${k + 1}`,
          path: `nested[${k}].input${k + 1}`,
          rule: {
            required: true,
            trigger: 'change',
          },
        },
      }
    }),
    ...Array.from({ length: 2 }, (v, k) => {
      return {
        type: 'Base:Input',
        formProp: {
          label: `Input ${k + 1}`,
          path: `nested[2].input[0][${k}]`,
          rule: {
            required: true,
            trigger: 'change',
          },
        },
      }
    }),
    ...Array.from({ length: 2 }, (v, k) => {
      return {
        type: 'Base:Input',
        formProp: {
          label: `Input ${k + 1}`,
          path: `a.b.c.input${k + 1}`,
          rule: {
            required: true,
            trigger: 'change',
          },
        },
      }
    }),
  ],
})
</script>

<template>
  <WDemoCard title="Nest Fields Form" description="common used in daily">
    <n-tabs type="line" animated>
      <n-tab-pane name="0" tab="Path To Object">
        <div class="mb-2 flex flex-nowrap gap-x-2">
          <WJSON :value="pathFormData" height="250px" />
          <WJSON :value="getObject" height="250px" />
        </div>

        <WForm :model="pathFormData" @hook="registerPath" />
      </n-tab-pane>

      <n-tab-pane name="1" tab="Object To Path">
        <n-alert title="Not Supported" type="warning" class="mb-2">
          Nested Object as Form Data is not supported
        </n-alert>

        <div class="mb-2 flex flex-nowrap gap-x-2">
          <WJSON :value="objectFormData" height="250px" />
          <WJSON :value="getPath" height="250px" />
        </div>

        <WForm :model="objectFormData" @hook="registerObject" />
      </n-tab-pane>
    </n-tabs>
  </WDemoCard>
</template>
