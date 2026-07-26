<script lang="ts" setup>
import type { ICompExtraArrowProps } from '.'

defineOptions({
  name: 'WCompExtraArrow',
})

const props = withDefaults(defineProps<ICompExtraArrowProps>(), { icon: 'ant-design:down-outlined' })

const getClass = computed(() => {
  if (typeof props.active === 'boolean') {
    return [
      'w-arrow',
      {
        'w-arrow--active': props.active,
        'right': props.right,
        'left': props.left,
      },
    ]
  }

  return 'u-none'
})
</script>

<template>
  <WIcon
    :icon="icon"
    width="16"
    :class="getClass"
  />
</template>

<style lang="scss" scoped>
.w-arrow {
  display: inline-block;
  transform: rotate(0deg);
  transform-origin: center center;
  transition: all 0.3s ease 0.1s;
  cursor: pointer;

  &--active {
    transform: rotate(180deg);
  }

  &.right {
    transform: rotate(-90deg);
  }

  &.right.w-arrow--active {
    transform: rotate(90deg);
  }

  &.left {
    transform: rotate(90deg);
  }

  &.left.w-arrow--active {
    transform: rotate(-90deg);
  }
}
</style>
