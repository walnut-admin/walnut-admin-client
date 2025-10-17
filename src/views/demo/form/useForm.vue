<script lang="ts" setup>
defineOptions({
  name: 'UseForm',
  defaultView: false,
})

const { stateRef: formData, resetState: resetFormData } = useState({
  input1: '11',
  input2: '22',
  input3: '33',
  input4: '44',
  input5: '55',
  input6: '66',
})

const [register, { validate, restoreValidation }] = useForm<typeof formData.value>({
  span: 8,
  labelWidth: 120,
  schemas: [
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 1',
        path: 'input1',
        rule: {
          required: true,
        },
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 2',
        path: 'input2',
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 3',
        path: 'input3',
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 4',
        path: 'input4',
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 5',
        path: 'input5',
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 6',
        path: 'input6',
      },
    },
    {
      type: 'Base:ButtonGroup',
      formProp: {
        label: 'Methods',
      },
      componentProp: {
        groups: [
          {
            textProp: 'Validate',
            onClick: async () => {
              const ret = await validate!()
              console.log('validate', ret)
            },
          },
          {
            textProp: 'Clear Validation',
            onClick: async () => {
              await restoreValidation!()
            },
          },
          {
            textProp: 'Reset to Initial State Form Data',
            onClick: () => {
              resetFormData()
            },
          },
        ],
      },
    },
  ],
})
</script>

<template>
  <WDemoCard title="useForm">
    <WJSON :value="formData" />

    <br>
    <br>

    <WForm :model="formData" @hook="register" />
  </WDemoCard>
</template>

<style lang="scss" scoped></style>
