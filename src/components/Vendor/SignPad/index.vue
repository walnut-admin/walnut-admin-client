<script lang="ts" setup>
import type { ICompVendorSignPadProps } from './types'
import { downloadByBase64 } from '@/utils/file/download'
import { genString } from 'easy-fns-ts'
import { toJpeg, toPng } from 'html-to-image'
import SignaturePad from 'signature_pad'

defineOptions({
  name: 'WVendorSignaturePad',
})

const props = withDefaults(defineProps<ICompVendorSignPadProps>(), {
  width: '100%',
  height: '100%',
  colors: () => ([
    'rgb(0,0,0)',
    'rgb(255,193,7)',
    'rgb(255,87,34)',
    'rgb(233,30,99)',
    'rgb(103,58,183)',
    'rgb(0,188,212)',
    'rgb(239,239,239)',

  ]),
  options: () => ({}),
})

const signPadId = ref(`signpad-${genString(8)}`)
const wrapperId = ref(`wrapper-${genString(8)}`)

const signPadInst = shallowRef<SignaturePad>()

const url = ref<string>()
const color = ref<string>('rgb(0, 0, 0)')
const pencil = ref<number>(2)

const isEmpty = () => signPadInst.value?.isEmpty()

watchEffect(() => {
  if (props.disabled)
    signPadInst.value?.off()
  else
    signPadInst.value?.on()
})

function onResize(c: HTMLCanvasElement) {
  if (!isEmpty())
    url.value = save()

  const ratio = Math.max(window.devicePixelRatio || 1, 1)

  const reg = /px/

  c.width = reg.test(props.width!)
    ? Number(props.width!.replace(/px/g, '')) * ratio
    : c.offsetWidth * ratio

  c.height = reg.test(props.height!)
    ? Number(props.height!.replace(/px/g, '')) * ratio
    : c.offsetHeight * ratio

  c.getContext('2d')!.scale(ratio, ratio)

  clear()

  if (props.defaultUrl || url.value)
    fromDataURL(props.defaultUrl || url.value!)
}

function onInit() {
  const canvas = document.getElementById(
    signPadId.value,
  )! as HTMLCanvasElement

  signPadInst.value = new SignaturePad(
    canvas,
    Object.assign(props.options!, { backgroundColor: 'rgb(255,255,255)' }),
  )

  onResize(canvas)

  useWindowResize(() => onResize(canvas))
}

function onChangePencil(v: number) {
  pencil.value = v
  signPadInst.value!.dotSize = v
  signPadInst.value!.minWidth = v
  signPadInst.value!.maxWidth = v
}

function onChangeColor(item: string) {
  color.value = item
  signPadInst.value!.penColor = item
}

function clear() {
  signPadInst.value?.clear()
}

function save(format?: string) {
  return format
    ? signPadInst.value?.toDataURL(format)
    : signPadInst.value?.toDataURL()
}

async function onFinalAction(type: 'png' | 'jpeg' = 'png', way: 'download' | 'get' = 'download') {
  const target = document.getElementById(wrapperId.value)!

  // filter left/right custom utils
  const filter = (node: Element) => {
    const exclusionClasses = ['signpad-utils']
    return !exclusionClasses.some((classname) => {
      if (node.classList)
        return Array.from(node.classList).includes(classname)
      return false
    })
  }

  if (type === 'png') {
    const res = await toPng(target, { filter })

    if (way === 'download')
      downloadByBase64(res)
    else
      return res
  }

  if (type === 'jpeg') {
    const res = await toJpeg(target, { filter })

    if (way === 'download')
      downloadByBase64(res)
    else
      return res
  }
}

function fromDataURL(url: string) {
  signPadInst.value?.fromDataURL(url)
}

function undo() {
  const data = signPadInst.value?.toData()

  if (data) {
    data.pop()
    signPadInst.value?.fromData(data)
  }
}

const getImage = (type: 'png' | 'jpeg' = 'png') => onFinalAction(type, 'get')

onMounted(() => {
  onInit()
})

defineExpose({
  save,
  clear,
  isEmpty,
  undo,
  fromDataURL,
  getImage,
})
</script>

<template>
  <n-watermark
    :id="wrapperId"
    :content="content"
    :font-size="16"
    :line-height="16"
    :width="192"
    :height="128"
    :x-offset="12"
    :y-offset="28"
    :rotate="-15"
    :style="{ width, height }"
  >
    <div
      class="relative"
      :style="{ width, height }"
      @touchmove.prevent
    >
      <canvas
        :id="signPadId"
        class="h-full w-full"
        :data-uid="signPadId"
        :disabled="disabled"
      />

      <!-- left utils -->
      <div
        class="signpad-utils absolute left-4 top-1/2 z-1 -translate-y-1/2"
      >
        <n-space vertical>
          <n-tooltip :disabled="disabled" trigger="click" placement="right">
            <template #trigger>
              <n-button :disabled="disabled" type="primary" text>
                <WIcon
                  icon="ant-design:font-colors-outlined"
                  width="20"
                />
              </n-button>
            </template>

            <template #default>
              <div class="h-48">
                <n-slider
                  v-model:value="pencil"
                  :max="20"
                  vertical
                  tooltip
                  show-tooltip
                  class="whitespace-nowrap"
                  @update:value="onChangePencil"
                />
              </div>
            </template>
          </n-tooltip>

          <n-tooltip :disabled="disabled" trigger="click" placement="right">
            <template #trigger>
              <n-button :disabled="disabled" type="info" text>
                <WIcon
                  icon="ant-design:bg-colors-outlined"
                  width="20"
                />
              </n-button>
            </template>

            <template #default>
              <div class="h-48 vstack gap-1">
                <div
                  v-for="(item, index) in props.colors" :key="index"
                  class="h-6 w-6"
                  :class="[
                    { 'shadow-2xl brightness-50 contrast-50': item === color },
                  ]"
                  :style="{ backgroundColor: item }"
                  @click="onChangeColor(item)"
                />
              </div>
            </template>
          </n-tooltip>

          <n-button :disabled="disabled" type="warning" text @click="undo">
            <WIcon icon="ant-design:undo-outlined" width="20" />
          </n-button>

          <n-button :disabled="disabled" type="error" text @click="clear">
            <WIcon icon="ant-design:clear-outlined" width="20" />
          </n-button>
        </n-space>
      </div>

      <!-- right utils -->
      <div
        class="signpad-utils z-{9999} absolute right-2 top-1/2 -translate-y-1/2"
      >
        <n-space vertical>
          <n-button
            :disabled="disabled"
            type="primary"
            text
            @click="onFinalAction('png')"
          >
            <div class="hstack items-center justify-center gap-2">
              <span> png </span>
              <WIcon icon="ant-design:download-outlined" width="20" />
            </div>
          </n-button>

          <n-button
            :disabled="disabled"
            type="primary"
            text
            @click="onFinalAction('jpeg')"
          >
            <div class="hstack items-center justify-center gap-2">
              <span> jpeg </span>
              <WIcon icon="ant-design:download-outlined" width="20" />
            </div>
          </n-button>
        </n-space>
      </div>
    </div>
  </n-watermark>
</template>

<style lang="scss" scoped></style>
