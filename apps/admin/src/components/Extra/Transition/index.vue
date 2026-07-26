<script lang="ts" setup>
import type { RendererElement } from 'vue'
import type { ICompExtraTransitionProps } from '.'
import { upperFirst } from 'lodash-es'

defineOptions({
  name: 'WCompExtraTransition',
  inheritAttrs: false,
})

const { transitionName = 'fade', mode = 'out-in', group = false, appear = false, duration = 300 } = defineProps<ICompExtraTransitionProps>()

function getActiveClass(m: 'In' | 'Out') {
  const isDash = transitionName?.includes('-')
  if (isDash) {
    return (
      `animate__animated animate__${transitionName?.split('-')[0] + m + upperFirst(transitionName.split('-')[1])}`
    )
  }
  return `animate__animated animate__${transitionName}${m}`
}

function onBeforeEnter(el: RendererElement) {
  el.style.animationDuration = `${duration / 1000}s`
}
</script>

<template>
  <TransitionGroup
    v-if="group"
    :enter-active-class="getActiveClass('In')"
    :leave-active-class="getActiveClass('Out')"
    :appear="appear"
    @before-enter="onBeforeEnter"
  >
    <slot />
  </TransitionGroup>
  <Transition
    v-else
    :mode="mode"
    :enter-active-class="getActiveClass('In')"
    :leave-active-class="getActiveClass('Out')"
    :appear="appear"
    @before-enter="onBeforeEnter"
  >
    <slot />
  </Transition>
</template>
