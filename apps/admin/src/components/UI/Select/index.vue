<script lang="tsx" setup>
import type { Recordable } from 'easy-fns-ts'
import type { SelectOption, SelectProps } from 'naive-ui'
import type { RenderOption } from 'naive-ui/es/_internal/select-menu/src/interface'
import type { ICompUISelectProps } from '.'

defineOptions({
  name: 'WCompUISelect',
})

const props = withDefaults(defineProps<ICompUISelectProps>(), {
  tooltipThreshold: 100,
})
const attrs = useAttrs() as SelectProps

const renderOption: RenderOption = ({ node, option, selected }) => {
  const label = (option as SelectOption).label
  return (props.tooltip && label && label.length > props.tooltipThreshold)
    ? (
        <n-tooltip {...props.tooltipProps}>
          {{
            default: () => attrs.renderLabel ? attrs.renderLabel(option, selected) : <span>{(option as Recordable).label}</span>,
            trigger: () => node,
          }}
        </n-tooltip>
      )
    : node
}
</script>

<template>
  <n-select :render-option="renderOption">
    <template v-for="(slot, index) of Object.keys($slots)" :key="index" #[slot]>
      <slot :name="slot" />
    </template>
  </n-select>
</template>
