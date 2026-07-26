<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { ICompExtraFlipperProps } from '.'

defineOptions({
  name: 'WCompExtraFlipper',
})

const {
  transitionTimingFunction = 'cubic-bezier(0.4, 0, 1, 1)',
  trigger = 'click',
  duration = '500ms',
  height = '100%',
  width = '100%',
} = defineProps<ICompExtraFlipperProps>()

const emits = defineEmits<{
  click: [e: MouseEvent]
}>()

const flipped = ref(false)

const getStyle = computed(() => ({
  wrapper: { width, height } as CSSProperties,
  face:
      {
        transitionDuration: duration,
        transitionTimingFunction,
        borderRadius: '20px',
        boxShadow: '0 3px 15px rgba(64, 64, 64, 0.45)',
      } as CSSProperties,
}))

function onClick(e: MouseEvent) {
  if (trigger === 'click')
    flipped.value = !flipped.value

  emits('click', e)
}

function onMouseEnterAndLeave() {
  if (trigger === 'hover')
    flipped.value = !flipped.value
}

defineExpose({
  onFlip: onClick,
})
</script>

<template>
  <div
    class="Flipper"
    :class="[{ 'Flipper--flipped': flipped }]"
    :style="getStyle.wrapper"
    @click="onClick"
    @mouseenter="onMouseEnterAndLeave"
    @mouseleave="onMouseEnterAndLeave"
  >
    <div class="Flipper__face Flipper__face--front" :style="getStyle.face">
      <slot name="front" />
    </div>

    <div class="Flipper__face Flipper__face--back" :style="getStyle.face">
      <slot name="back" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Flipper {
  position: relative;
  perspective: 1000px;
}
.Flipper__face {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
.Flipper__face--back,
.Flipper--flipped .Flipper__face--front {
  transform: rotateY(180deg);
  visibility: hidden;
}
.Flipper--flipped {
  .Flipper__face--back {
    transform: rotateY(360deg);
    visibility: visible;
  }
}
</style>
