<script lang="ts" setup>
import type { ICompUIModalProps } from '.'
import { toggleClass } from 'easy-fns-ts'

defineOptions({
  name: 'WCompUIModal',
})

const props = withDefaults(defineProps<ICompUIModalProps>(), {
  width: '25%',
  height: 'auto',
  draggable: true,
  fullscreen: true,
  defaultButton: true,
  segmented: true,
})

const emits = defineEmits<{ yes: [], no: [], fullscreen: [boolean] }>()

const show = defineModel<boolean>('show', { required: true, default: false })

const modalRef = useTemplateRef<any>('modalRef')
const isFullscreen = ref(false)

function onFullScreen() {
  const dragDom = modalRef.value?.containerRef.querySelector('.w-modal')

  isFullscreen.value = !isFullscreen.value

  toggleClass(dragDom, 'modal-fullscreen', isFullscreen.value)

  emits('fullscreen', isFullscreen.value)
}

function onNo() {
  emits('no')
}

function onYes() {
  emits('yes')
}

async function onUpdateShow(v: boolean) {
  if (props.beforeClose) {
    const res = await props.beforeClose()
    if (!res)
      return

    show.value = v
    if (!v)
      onNo()
  }
  else {
    show.value = v
    if (!v)
      onNo()
  }
}
</script>

<template>
  <n-modal
    ref="modalRef"
    preset="card"
    :show="show"
    :show-icon="false"
    :auto-focus="false"
    :style="{ width }"
    :segmented="
      segmented
        ? {
          content: 'soft',
          footer: 'soft',
        }
        : {}
    "
    @update:show="onUpdateShow"
  >
    <template #header>
      <WTitle prefix="bar" :help-message="helpMessage">
        {{ title }}
      </WTitle>
    </template>

    <template v-if="fullscreen" #header-extra>
      <WAppFullScreen
        class="mr-2 cursor-pointer leading-1"
        :is-fullscreen="isFullscreen"
        :click-event="onFullScreen"
      />
    </template>

    <template #default>
      <WScrollbar :height="isFullscreen ? 'calc(100vh - 180px)' : height">
        <n-spin :show="loading">
          <slot />
        </n-spin>
      </WScrollbar>
    </template>

    <template #action>
      <n-space v-if="defaultButton" size="small" class="float-right">
        <n-button size="small" :disabled="loading" @click="onUpdateShow(false)">
          {{ $t('app.base.no') }}
        </n-button>

        <n-button
          size="small"
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="onYes"
        >
          {{ $t('app.base.yes') }}
        </n-button>
      </n-space>

      <slot name="action" />
    </template>
  </n-modal>
</template>

<style>
.modal-fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}
</style>
