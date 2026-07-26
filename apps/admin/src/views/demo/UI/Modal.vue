<script lang="ts" setup>
defineOptions({
  name: 'ModalDemo',
  defaultView: false,
})

const modalShow = ref(false)

const configFormData = ref({
  title: 'Modal Title',
  helpMessage: 'Modal Help Message',
  closable: true,
  maskClosable: true,
  width: '40%',
  height: '50vh',
  count: 20,
  loading: false,
  draggable: true,
  scope: false,
  fullscreen: true,
})

const [register] = useForm<typeof configFormData.value>({
  labelWidth: 120,
  yGap: 10,
  showFeedback: false,
  schemas: [
    {
      type: 'Base:Input',
      formProp: {
        label: 'Title',
        path: 'title',
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Help Message',
        path: 'helpMessage',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Closable',
        path: 'closable',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Mask Closable',
        path: 'maskClosable',
      },
    },
    {
      type: 'Base:InputNumber',
      formProp: {
        label: 'Counter',
        path: 'count',
      },
      componentProp: {
        step: 20,
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Width',
        path: 'width',
      },
    },
    {
      type: 'Base:Input',
      formProp: {
        label: 'Height',
        path: 'height',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Loading',
        path: 'loading',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Draggable',
        path: 'draggable',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Full Screen',
        path: 'fullscreen',
      },
    },
    {
      type: 'Base:Switch',
      formProp: {
        label: 'Scoped',
        path: 'scope',
      },
    },
    {
      type: 'Base:Button',
      componentProp: {
        textProp: 'Open Modal',
        onClick: () => {
          modalShow.value = true
        },
      },
    },
  ],
})
</script>

<template>
  <WDemoCard id="modal-target" class="relative" title="Modal">
    <n-space vertical>
      <WForm :model="configFormData" @hook="register" />
    </n-space>
  </WDemoCard>

  <WModal
    v-model:show="modalShow"
    :title="configFormData.title"
    :help-message="configFormData.helpMessage"
    :closable="configFormData.closable"
    :mask-closable="configFormData.maskClosable"
    :width="configFormData.width"
    :height="configFormData.height"
    :loading="configFormData.loading"
    :draggable="configFormData.draggable"
    :fullscreen="configFormData.fullscreen"
    :to="configFormData.scope ? '#modal-target' : undefined"
    :trap-focus="!configFormData.scope"
    :block-scroll="!configFormData.scope"
    @yes="modalShow = false"
    @no="modalShow = false"
  >
    <div v-for="item in configFormData.count" :key="item">
      this is modal content {{ item }}
    </div>
  </WModal>
</template>
