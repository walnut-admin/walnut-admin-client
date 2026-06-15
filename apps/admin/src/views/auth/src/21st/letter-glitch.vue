<script setup lang="ts">
// https://21st.dev/davidhzdev/letter-glitch/default
import type { CSSProperties } from 'vue'

interface Props {
  glitchColors?: string[]
  glitchSpeed?: number
  centerVignette?: boolean
  outerVignette?: boolean
  smooth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  glitchColors: () => ['#2b4539', '#61dca3', '#61b3dc'],
  glitchSpeed: 50,
  centerVignette: false,
  outerVignette: true,
  smooth: true,
})

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const animationRef = shallowRef<number | null>(null)
const letters = ref<{
  char: string
  color: string
  targetColor: string
  colorProgress: number
}[]>([])
const grid = ref({ columns: 0, rows: 0 })
const context = ref<CanvasRenderingContext2D | null>(null)
const lastGlitchTime = ref(Date.now())

let resizeTimeout: ReturnType<typeof setTimeout>

const fontSize = 16
const charWidth = 10
const charHeight = 20

const lettersAndSymbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-=_+[]{}<>,0123456789'.split('')

function getRandomChar() {
  return lettersAndSymbols[
    Math.floor(Math.random() * lettersAndSymbols.length)
  ]
}

function getRandomColor() {
  return props.glitchColors[Math.floor(Math.random() * props.glitchColors.length)]
}

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

function interpolateColor(start: { r: number, g: number, b: number }, end: { r: number, g: number, b: number }, factor: number) {
  const r = Math.round(start.r + (end.r - start.r) * factor)
  const g = Math.round(start.g + (end.g - start.g) * factor)
  const b = Math.round(start.b + (end.b - start.b) * factor)
  return `rgb(${r}, ${g}, ${b})`
}

function calculateGrid(width: number, height: number) {
  const columns = Math.ceil(width / charWidth)
  const rows = Math.ceil(height / charHeight)
  return { columns, rows }
}

function initializeLetters(columns: number, rows: number) {
  grid.value = { columns, rows }
  const totalLetters = columns * rows
  letters.value = Array.from({ length: totalLetters }, () => ({
    char: getRandomChar(),
    color: getRandomColor(),
    targetColor: getRandomColor(),
    colorProgress: 1,
  }))
}

function drawLetters() {
  if (!canvasRef.value || !context.value || letters.value.length === 0)
    return

  const canvas = canvasRef.value
  const ctx = context.value
  const { width, height } = canvas.getBoundingClientRect()
  ctx.clearRect(0, 0, width, height)
  ctx.font = `${fontSize}px monospace`
  ctx.textBaseline = 'top'

  for (let i = 0; i < letters.value.length; i++) {
    const letterData = letters.value[i]
    const x = (i % grid.value.columns) * charWidth
    const y = Math.floor(i / grid.value.columns) * charHeight
    ctx.fillStyle = letterData.color
    ctx.fillText(letterData.char, x, y)
  }
}

function resizeCanvasAndDraw() {
  if (!canvasRef.value)
    return
  const canvas = canvasRef.value
  const parent = canvas.parentElement
  if (!parent)
    return

  const dpr = window.devicePixelRatio || 1
  const rect = parent.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`

  if (context.value) {
    context.value.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const { columns, rows } = calculateGrid(rect.width, rect.height)
  initializeLetters(columns, rows)
  drawLetters()
}

function updateLetters() {
  if (!letters.value || letters.value.length === 0)
    return
  const updateCount = Math.max(1, Math.floor(letters.value.length * 0.05))
  for (let i = 0; i < updateCount; i++) {
    const index = Math.floor(Math.random() * letters.value.length)
    if (!letters.value[index])
      continue
    letters.value[index].char = getRandomChar()
    letters.value[index].targetColor = getRandomColor()
    if (!props.smooth) {
      letters.value[index].color = letters.value[index].targetColor
      letters.value[index].colorProgress = 1
    }
    else {
      letters.value[index].colorProgress = 0
    }
  }
}

function handleSmoothTransitions() {
  let needsRedraw = false
  letters.value.forEach((letter) => {
    if (letter.colorProgress < 1) {
      letter.colorProgress += 0.05
      if (letter.colorProgress > 1)
        letter.colorProgress = 1
      const startRgb = hexToRgb(letter.color)
      const endRgb = hexToRgb(letter.targetColor)
      if (startRgb && endRgb) {
        letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress)
        needsRedraw = true
      }
    }
  })
  if (needsRedraw) {
    drawLetters()
  }
}

function animate() {
  const now = Date.now()
  if (now - lastGlitchTime.value >= props.glitchSpeed) {
    updateLetters()
    drawLetters()
    lastGlitchTime.value = now
  }
  if (props.smooth) {
    handleSmoothTransitions()
  }
  animationRef.value = requestAnimationFrame(animate)
}

function startAnimation() {
  if (animationRef.value) {
    cancelAnimationFrame(animationRef.value)
  }
  animationRef.value = requestAnimationFrame(animate)
}

function handleResize() {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    if (animationRef.value)
      cancelAnimationFrame(animationRef.value)
    resizeCanvasAndDraw()
    startAnimation()
  }, 100)
}

onMounted(() => {
  if (canvasRef.value) {
    context.value = canvasRef.value.getContext('2d')
    resizeCanvasAndDraw()
    startAnimation()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (animationRef.value) {
    cancelAnimationFrame(animationRef.value)
  }
  window.removeEventListener('resize', handleResize)
  clearTimeout(resizeTimeout)
})

watch(() => [props.glitchSpeed, props.smooth, props.glitchColors], () => {
  startAnimation()
})

const containerStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: '#000000',
  overflow: 'hidden',
}

const canvasStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '100%',
}

const outerVignetteStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)',
}

const centerVignetteStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
}
</script>

<template>
  <div :style="containerStyle">
    <canvas ref="canvasRef" :style="canvasStyle" />
    <div v-if="outerVignette" :style="outerVignetteStyle" />
    <div v-if="centerVignette" :style="centerVignetteStyle" />
  </div>
</template>
