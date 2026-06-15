<script lang="ts" setup>
import type { WForm } from '@/components/UI/Form'

defineOptions({
  name: 'DynamicForm',
  defaultView: false,
})

const configFormData = ref({
  transitionNameGlobal: undefined as ValueOfAppConstTransitionName | undefined,
  visibleModeGlobal: false,
  visibleMode: 'auto-forward' as WForm.FormVisibleMode,
  showFeedback: true,
  vIf: true,
  vShow: true,
  vShowInput3: true,
  transition1: 'fade-right-big' as ValueOfAppConstTransitionName,
  transition2: 'fade-left-big' as ValueOfAppConstTransitionName,
  disabled: false,
  labelHelpMessage: true,
  labelWidth: 100,
  span: 8,
  xGap: 20,
  yGap: 0,
  inputOneLabel: 'Input 1',
  inputOneSpan: 8,
})

const formData = ref({
  input1: undefined,
  input2: undefined,
  input3: 'input3',
  input4: undefined,
  input5: undefined,
  input6: undefined,
})

const [register1] = useForm<typeof configFormData.value>({
  labelWidth: 200,
  span: 12,
  visibleMode: 'no-move',
  schemas: [
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Global Transition',
        path: 'transitionNameGlobal',
        labelHelpMessage: 'Rules is simple, scoped filed in form item has higher priority than global field in form prop',
      },
      componentProp: {},
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Global Visible Mode',
        path: 'visibleModeGlobal',
        labelHelpMessage: 'Rules is simple, scoped filed in form item has higher priority than global field in form prop',
      },
      componentProp: {},
    },

    {
      type: 'Base:Switch',
      formProp: {
        label: 'NForm Built In Feedback',
        path: 'showFeedback',
      },
      componentProp: {},
    },

    {
      type: 'Base:Radio',
      formProp: {
        label: 'v-if/v-show position mode',
        path: 'visibleMode',
      },
      componentProp: {
        options: [
          {
            label: 'AutoForward',
            value: 'auto-forward',
          },
          {
            label: 'NoMove',
            value: 'no-move',
          },
        ],
      },
      visibleProp: {
        vIf: ({ formData }) => formData.visibleModeGlobal,
      },
    },

    {
      type: 'Base:Switch',
      formProp: {
        label: '`v-if` to control `Input 1`',
        path: 'vIf',
      },
    },
    {
      type: 'Extra:TransitionSelect',
      formProp: {
        label: 'Transition for Input 1',
        path: 'transition1',
      },
      visibleProp: {
        vIf: ({ formData }) => !formData.transitionNameGlobal,
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: '`v-show` to control `Input 2`',
        path: 'vShow',
      },
    },
    {
      type: 'Extra:TransitionSelect',
      formProp: {
        label: 'Transition for Input 2',
        path: 'transition2',
      },
      visibleProp: {
        vIf: ({ formData }) => !formData.transitionNameGlobal,
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: '`v-show` to control `Input 3`',
        path: 'vShowInput3',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Disable Input 6',
        path: 'disabled',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Input 3 Label help message',
        path: 'labelHelpMessage',
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        label: 'Label width',
        path: 'labelWidth',
      },
      componentProp: {
        min: 0,
        max: 150,
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        label: 'Span',
        path: 'span',
      },
      componentProp: {
        min: 0,
        max: 24,
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        label: 'x-gap',
        path: 'xGap',
      },
      componentProp: {
        min: 0,
        max: 100,
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        label: 'y-gap',
        path: 'yGap',
      },
      componentProp: {
        min: 0,
        max: 100,
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 1 label',
        path: 'inputOneLabel',
      },
    },
    {
      type: 'Raw:Slider',
      formProp: {
        label: 'Input 1 span',
        path: 'inputOneSpan',
      },
      componentProp: {
        min: 0,
        max: 24,
      },
    },
  ],
})

const [register2] = useForm<typeof formData.value>({
  transitionName: computed(() => configFormData.value.transitionNameGlobal ? 'slide-down' : ''),
  visibleMode: computed(() => configFormData.value.visibleMode),
  showFeedback: computed(() => configFormData.value.showFeedback),
  span: computed(() => configFormData.value.span),
  labelWidth: computed(() => configFormData.value.labelWidth),
  xGap: computed(() => configFormData.value.xGap),
  yGap: computed(() => configFormData.value.yGap),
  schemas: [
    {
      type: 'Base:Input',
      formProp: {
        label: computed(() => configFormData.value.inputOneLabel),
        path: 'input1',
        labelHelpMessage: ['Input 1 has scoped visible mode, will always move forward no matter global visible mode'],
      },
      componentProp: {
        clearable: true,
      },
      gridProp: {
        span: computed(() => configFormData.value.inputOneSpan),
      },
      transitionProp: {
        transitionName: computed(() => configFormData.value.transition1),
      },
      visibleProp: {
        vIf: computed(() => configFormData.value.vIf),
        visibleMode: 'auto-forward',
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 2',
        path: 'input2',
      },
      componentProp: {
        clearable: true,
      },
      transitionProp: {
        transitionName: computed(() => configFormData.value.transition2),
      },
      visibleProp: {
        vShow: computed(() => configFormData.value.vShow),
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 3',
        path: 'input3',
        labelHelpMessage: computed(() =>
          configFormData.value.labelHelpMessage
            ? 'Input 4 will show once Input 3 has value.'
            : '',
        ),
      },
      componentProp: {
        clearable: true,
      },
      visibleProp: {
        vShow: computed(() => configFormData.value.vShowInput3),
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 4',
        path: 'input4',
        labelHelpMessage: 'Input 4 has scoped transition name',
      },
      componentProp: {
        clearable: true,
      },
      visibleProp: {
        vShow: ({ formData }) => !!formData.input3,
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 5',
        path: 'input5',
      },
      componentProp: {
        clearable: true,
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Input 6',
        path: 'input6',
      },
      componentProp: {
        clearable: true,
        disabled: computed(() => configFormData.value.disabled),
      },
    },
  ],
})
</script>

<template>
  <WDemoCard title="Dynamic Form" description="Some features.">
    <WJSON :value="configFormData" height="250px" />

    <WForm :model="configFormData" @hook="register1" />

    <WJSON :value="formData" />

    <WForm :model="formData" @hook="register2" />
  </WDemoCard>
</template>

<style lang="scss" scoped></style>
