<script lang="ts" setup>
import type { ICompUIDropdownInst, ICompUIDropdownProps } from '.'

defineOptions({
  name: 'WCompUIDropdown',
})

const props = defineProps<ICompUIDropdownProps>()

const emits = defineEmits<{ hook: [inst: ICompUIDropdownInst] }>()

const { setProps, getProps } = useProps<ICompUIDropdownProps>(props)

const show = ref(false)
const x = ref(0)
const y = ref(0)

function openDropdown(e: MouseEvent) {
  x.value = e.clientX
  y.value = e.clientY
  show.value = true
}

const closeDropdown = () => (show.value = false)

emits('hook', { setProps, openDropdown, closeDropdown })

defineExpose({
  setProps,
  openDropdown,
  closeDropdown,
})
</script>

<template>
  <n-dropdown
    v-bind="getProps.dropdownProps"
    trigger="manual"
    placement="bottom-start"
    :show="show"
    :x="x"
    :y="y"
    @clickoutside="show = false"
  />
</template>
