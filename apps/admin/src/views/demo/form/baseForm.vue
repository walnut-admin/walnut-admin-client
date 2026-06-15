<script lang="tsx" setup>
import type { Recordable } from 'easy-fns-ts'
import type { WForm } from '@/components/UI/Form'
import { getTreeData, options } from '../data'

defineOptions({
  name: 'BaseForm',
  defaultView: false,
})

const { stateRef: formData, resetState: resetFormData } = useState<Recordable>({
  // base
  formSlot: null,
  formRender: null,

  // ui
  formCheckbox: null,
  formColorPicker: null,
  formDatePicker: null,
  formDynamicTags: [],
  formInput: null,
  formInputNumber: null,
  formRadio: null,
  formSelect: null,
  formSwitch: null,
  formTimePicker: null,
  formTree: null,
  formTreeSelect: null,

  // extra
  formEmailInput: null,
  formIconPicker: null,
  formLocaleSelect: null,
  formPassword: null,
  formPhoneNumberInput: null,
  formSMSInput: null,
  formTransitionPicker: null,

  // raw
  formDynamicInput: null,
  formSlider: null,

  // business
  formAreaCascader: null,
  formDictSelect: null,
  formDictCheckbox: null,
  formDictRadio: null,

  formRoleSelect: null,
  formTinymce: null,
})

const formRef = useTemplateRef<WForm.Inst.WFormInst<typeof formData.value>>('formRef')

const msg = useAppMessage()

const schemas: WForm.Schema.Item<typeof formData.value>[] = [
  {
    type: 'Base:Slot',
    formProp: {
      label: 'Slot',
      path: 'formSlot',
    },
  },
  {
    type: 'Base:Render',
    formProp: {
      label: 'Render',
      path: 'formRender',
    },
    componentProp: {
      render: ({ formData: _formData }) => (<n-input vModel={[_formData.formRender, 'value']}></n-input>),
    },
  },

  {
    type: 'Extend:Divider',
    componentProp: {
      title: 'UI Components',
    },
  },
  // ui
  {
    type: 'Base:Button',
    formProp: {
      label: 'Button',
    },
    componentProp: {
      textProp: 'Single Button',
      type: 'info',
      round: true,
      onClick: () => {
        console.log('single button in form')
      },
    },
  },
  {
    type: 'Base:ButtonConfirm',
    formProp: {
      label: 'Confirm Button',
    },
    componentProp: {
      confirmMsg: 'Form Confirm Button ???',
      buttonProps: {
        textProp: 'Trigger Text',
        type: 'primary',
      },
      onConfirm: () => {
        console.log('button confirmed')
      },
    },
  },
  {
    type: 'Base:ButtonGroup',
    formProp: {
      label: 'Button Group',
    },
    componentProp: {
      groups: [
        {
          textProp: 'Validate',
          onClick: async () => {
            const valid = await formRef.value?.validate()
            if (valid)
              msg.success('Success')
            else
              msg.error('Error')
          },
        },
        {
          textProp: 'Clear Validation',
          onClick: () => {
            formRef.value?.restoreValidation()
          },
        },
        {
          textProp: 'Reset Form Data',
          onClick: () => {
            resetFormData()
          },
        },
      ],
    },
    gridProp: {
      span: 24,
    },
  },
  {
    type: 'Base:ButtonRetry',
    formProp: {
      label: 'Retry Button',
    },
    componentProp: {
      retryKey: 'form-retry-button',
      retrySeconds: 10,
      textProp: 'Retry button in form ???',
      onRetryClick: (startCount: Fn) => {
        console.log('retry clicked')
        startCount()
      },
    },
  },

  {
    type: 'Base:Checkbox',
    formProp: {
      label: 'Checkbox',
      path: 'formCheckbox',
    },
    componentProp: {
      options,
      valueType: 'number',
      multiple: true,
      valueSeparator: '|',
    },
  },
  {
    type: 'Base:ColorPicker',
    formProp: {
      label: 'Color Picker',
      path: 'formColorPicker',
    },
    componentProp: {
      eyeDropper: true,
    },
  },

  {
    type: 'Base:DatePicker',
    formProp: {
      label: 'DatePicker',
      path: 'formDatePicker',
    },
    componentProp: {
      type: 'datetime',
    },
  },

  {
    type: 'Base:DynamicTags',
    formProp: {
      label: 'DynamicTags',
      path: 'formDynamicTags',
      ruleType: 'array',
    },
    componentProp: {
      round: true,
    },
  },

  {
    type: 'Base:Input',
    formProp: {
      label: 'Input',
      path: 'formInput',
      labelHelpMessage: [
        '1. Allow string and string array',
        '2. Also allow `true` to auto translate base on `formProps.path`',
      ],
    },
    componentProp: {
      type: 'textarea',
      showCount: true,
      maxlength: 100,
    },
  },
  {
    type: 'Base:InputNumber',
    formProp: {
      label: 'InputNumber',
      path: 'formInputNumber',
    },
    componentProp: {
      min: 3,
      max: 100,
    },
  },

  {
    type: 'Base:Radio',
    formProp: {
      label: 'Radio',
      path: 'formRadio',
    },
    componentProp: {
      options,
    },
  },
  {
    type: 'Base:Select',
    formProp: {
      label: 'Select',
      path: 'formSelect',
    },
    componentProp: {
      options,
      valueType: 'number',
      multiple: true,
      valueSeparator: ',',
    },
  },
  {
    type: 'Base:Switch',
    formProp: {
      label: 'Switch',
      path: 'formSwitch',
      first: true,
    },
    componentProp: {},
  },
  {
    type: 'Base:TimePicker',
    formProp: {
      label: 'TimePicker',
      path: 'formTimePicker',
    },
    componentProp: {
      format: 'HH:mm:ss',
      class: 'w-full',
    },
  },
  {
    type: 'Base:Tree',
    formProp: {
      label: 'Tree',
      path: 'formTree',
    },
    componentProp: {
      maxHeight: '200px',
      treeProps: {
        data: getTreeData(),
        labelField: '_label',
        keyField: '_id',
        blockLine: true,
        blockNode: true,
      },
    },
  },
  {
    type: 'Base:TreeSelect',
    formProp: {
      label: 'TreeSelect',
      path: 'formTreeSelect',
    },
    componentProp: {
      treeSelectProps: {
        options: getTreeData(),
        labelField: '_label',
        keyField: '_id',
        clearable: true,
      },
    },
  },

  {
    type: 'Extend:Divider',
    componentProp: {
      title: 'Extra Components',
    },
  },
  // extra
  {
    type: 'Extra:EmailInput',
    formProp: {
      label: 'Email Input',
      path: 'formEmailInput',
    },
    componentProp: {},
  },
  {
    type: 'Extra:IconPicker',
    formProp: {
      label: 'Icon Picker',
      path: 'formIconPicker',
    },
    componentProp: { preset: 'input' },
  },
  {
    type: 'Extra:LocaleSelect',
    formProp: {
      label: 'Locale Select',
      path: 'formLocaleSelect',
    },
    componentProp: {
      prefix: 'dict.',
      creatable: false,
    },
  },
  {
    type: 'Extra:Password',
    formProp: {
      label: 'Password Input',
      path: 'formPassword',
    },
    componentProp: { capslock: true },
  },
  {
    type: 'Extra:PhoneNumberInput',
    formProp: {
      label: 'Phone Number',
      path: 'formPhoneNumberInput',
    },
    componentProp: {
      preferred: true,
      example: true,
      autoDefaultCountry: true,
    },
  },
  {
    type: 'Extra:VerifyCode',
    formProp: {
      label: 'SMS Input',
      path: 'formSMSInput',
    },
    componentProp: {
      retryKey: 'form-sms-input',
      retrySeconds: 10,
    },
  },
  {
    type: 'Extra:TransitionSelect',
    formProp: {
      label: 'Transition Select',
      path: 'formTransitionPicker',
    },
  },

  {
    type: 'Extend:Divider',
    componentProp: {
      title: 'Naive UI Raw Components',
    },
  },
  // raw
  {
    type: 'Raw:DynamicInput',
    formProp: {
      label: 'Dynamic Input',
      path: 'formDynamicInput',
      ruleType: 'array',
    },
    componentProp: {
      preset: 'pair',
      showSortButton: true,
      min: 1,
    },
  },
  {
    type: 'Raw:Slider',
    formProp: {
      label: 'Slider',
      path: 'formSlider',
    },
    componentProp: {
      max: 24,
      min: 10,
    },
  },

  {
    type: 'Extend:Divider',
    componentProp: {
      title: 'Business Components, need API support',
    },
  },
  // business
  {
    type: 'Business:AreaCascader',
    formProp: {
      label: 'Area Cascader',
      path: 'formAreaCascader',
    },
    componentProp: {
      showPath: false,
      multiple: true,
      depth: 2,
    },
  },
  {
    type: 'Business:Dict',
    formProp: {
      label: 'Dict Select',
      path: 'formDictSelect',
    },
    componentProp: {
      dictType: 'gbt_sex',
    },
  },
  {
    type: 'Business:Dict',
    formProp: {
      label: 'Dict Checkbox',
      path: 'formDictCheckbox',
    },
    componentProp: {
      dictType: 'gbt_sex',
      renderType: 'checkbox',
    },
  },
  {
    type: 'Business:Dict',
    formProp: {
      label: true,
      path: 'formDictRadio',
      labelHelpMessage: 'Use dict name as form item label',
    },
    componentProp: {
      dictType: 'gbt_sex',
      renderType: 'radio',
    },
  },

  // {
  //   type: 'Extend:RoleSelect',
  //   formProp: {
  //     label: 'Role Select',
  //     path: 'formRoleSelect',
  //   },
  // },

  // {
  //   type: 'Vendor:Tinymce',
  //   formProp: {
  //     label: 'Tinymce',
  //     path: 'formTinymce',
  //   },
  // },

]
</script>

<template>
  <WDemoCard
    title="Base Form"
    description="Display all support types in schemas."
  >
    <div class="sticky top-24 z-50 h-full">
      <div class="bg-bodyColor p-4">
        <WJSON :value="formData" height="300px" />
      </div>
    </div>

    <WForm
      ref="formRef"
      class="pt-4"
      :model="formData"
      :schemas="schemas"
      label-width="120px"
      base-rules
      :span="12"
    >
      <template #formSlot>
        <n-input v-model:value="formData.formSlot" />
      </template>
    </WForm>
  </WDemoCard>
</template>

<style lang="scss" scoped></style>
