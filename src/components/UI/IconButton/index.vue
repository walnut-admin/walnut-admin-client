<script lang="ts" setup>
import type { ICompUIIconButtonProps } from '.'

defineOptions({
  name: 'WCompUIIconButton',
})

withDefaults(defineProps<ICompUIIconButtonProps>(), {
  tooltip: false,
  confirm: false,
  confirmMsg: 'app.base.confirm',
})

const emits = defineEmits<{ confirm: [] }>()

/* thanks to vueuse createReusableTemplate, make this more easy to read but a little dumb? */
/* IS THIS STUPID? OVER KILLED */
const [DefineIconButton, ReuseIconButton] = createReusableTemplate()
const [DefineConfirm, ReuseConfirm] = createReusableTemplate()
const [DefineTooltip, ReuseTooltip] = createReusableTemplate()

function onPositiveClick() {
  emits('confirm')
}
</script>

<template>
  <DefineIconButton>
    <div class="flex items-center">
      <WButton v-bind="buttonProps" text :debounce="0">
        <WIcon v-bind="iconProps!" />
      </WButton>
    </div>
  </DefineIconButton>

  <DefineConfirm>
    <n-popconfirm v-bind="popConfirmProps" @positive-click="onPositiveClick">
      <template #default>
        <div class="whitespace-nowrap">
          {{ $t(confirmMsg) }}
        </div>
      </template>

      <template #trigger>
        <ReuseIconButton @click.prevent.capture />
      </template>
    </n-popconfirm>
  </DefineConfirm>

  <DefineTooltip>
    <n-tooltip v-bind="tooltipProps" trigger="hover">
      <template #default>
        <div class="whitespace-nowrap">
          {{ tooltipMsg }}
        </div>
      </template>

      <template #trigger>
        <span class="inline-flex items-center">
          <ReuseConfirm v-if="confirm" />
          <ReuseIconButton v-else />
        </span>
      </template>
    </n-tooltip>
  </DefineTooltip>

  <ReuseIconButton v-if="!tooltip && !confirm" />
  <ReuseTooltip v-else-if="tooltip" />
  <ReuseConfirm v-else-if="confirm" />
</template>
