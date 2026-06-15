<script lang="ts" setup>
import type { DrawerPlacement } from 'naive-ui'

defineOptions({
  name: 'DrawerDemo',
  defaultView: false,
})

const drawerShow = ref(false)

const configFormData = ref({
  title: 'Drawer Title',
  helpMessage: 'Drawer Help Message',
  closable: true,
  maskClosable: true,
  width: '40%',
  count: 40,
  loading: false,
  placement: 'right' as DrawerPlacement,
  scope: false,
  resizable: false,
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
      componentProp: {
        disabled: computed(() => configFormData.value.resizable),
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
      type: 'Base:Radio',
      formProp: {
        label: 'Placement',
        path: 'placement',
      },
      componentProp: {
        options: ['top', 'right', 'bottom', 'left'].map(item => ({
          label: item,
          value: item,
        })),
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
      type: 'Base:Switch',
      formProp: {
        label: 'Resizable',
        path: 'resizable',
      },
    },
    {
      type: 'Base:Button',
      componentProp: {
        textProp: 'Open Drawer',
        onClick: () => {
          drawerShow.value = true
        },
      },
    },
  ],
})
</script>

<template>
  <WDemoCard id="drawer-target" class="relative" title="Drawer">
    <n-space vertical>
      <WForm :model="configFormData" @hook="register" />
    </n-space>
  </WDemoCard>

  <WDrawer
    v-model:show="drawerShow"
    :title="configFormData.title"
    :help-message="configFormData.helpMessage"
    :closable="configFormData.closable"
    :mask-closable="configFormData.maskClosable"
    :width="configFormData.resizable ? undefined : configFormData.width"
    :loading="configFormData.loading"
    :placement="configFormData.placement"
    :to="configFormData.scope ? '#drawer-target' : undefined"
    :trap-focus="!configFormData.scope"
    :block-scroll="!configFormData.scope"
    :resizable="configFormData.resizable"
    :default-width="configFormData.width"
    @yes="drawerShow = false"
    @no="drawerShow = false"
  >
    <div v-for="item in configFormData.count" :key="item">
      this is drawer content {{ item }}
    </div>
  </WDrawer>
</template>
