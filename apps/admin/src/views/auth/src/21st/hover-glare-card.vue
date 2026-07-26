<script setup lang="ts">
// https://21st.dev/davidhzdev/hover-glare-card/default
import type { CSSProperties } from 'vue'

interface Props {
  glareColor?: string
  glareOpacity?: number
  glareAngle?: number
  glareSize?: number
  transitionDuration?: number
  playOnce?: boolean
  className?: string
  style?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  glareColor: '#ffffff',
  glareOpacity: 0.3,
  glareAngle: -45,
  glareSize: 250,
  transitionDuration: 1200,
  playOnce: false,
  className: '',
  style: () => ({}),
})

const overlayRef = shallowRef<HTMLElement>()
const hasAnimated = ref(false)

const getDefaultGlareColor = computed(() => isDark.value ? props.glareColor : '#000000')

function hexToRgba(hex: string, alpha: number): string {
  if (!/^#[\dA-F]{3,6}$/i.test(hex)) {
    return `rgba(255, 255, 255, ${alpha})`
  }

  let color = hex.substring(1)

  if (color.length === 3) {
    color = color.split('').map(char => char + char).join('')
  }

  const r = Number.parseInt(color.substring(0, 2), 16)
  const g = Number.parseInt(color.substring(2, 4), 16)
  const b = Number.parseInt(color.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function animateIn() {
  const el = overlayRef.value
  if (!el || (props.playOnce && hasAnimated.value))
    return

  el.style.transition = 'none'
  el.style.backgroundPosition = '-100% -100%, 0 0'

  // 触发重排确保样式应用
  void el.offsetHeight

  el.style.transition = `${props.transitionDuration}ms ease`
  el.style.backgroundPosition = '100% 100%, 0 0'

  if (props.playOnce) {
    hasAnimated.value = true
  }
}

function animateOut() {
  const el = overlayRef.value
  if (!el || (props.playOnce && hasAnimated.value))
    return

  el.style.transition = `${props.transitionDuration}ms ease`
  el.style.backgroundPosition = '-100% -100%, 0 0'
}

const overlayStyle = computed((): CSSProperties => {
  const rgbaColor = hexToRgba(getDefaultGlareColor.value, props.glareOpacity)
  return {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(${props.glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgbaColor} 70%, hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${props.glareSize}% ${props.glareSize}%, 100% 100%`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-100% -100%, 0 0',
    pointerEvents: 'none',
    zIndex: 100,
  }
})

const containerClass = computed(() => `relative grid place-items-center overflow-hidden cursor-pointer ${props.className}`)
</script>

<template>
  <div
    :class="containerClass"
    :style="props.style"
    @mouseenter="animateIn"
    @mouseleave="animateOut"
  >
    <div ref="overlayRef" :style="overlayStyle" />
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
