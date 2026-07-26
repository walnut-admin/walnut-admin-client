<script lang="ts" setup>
import type { ICompUIDrawerProps } from '.'

defineOptions({
  name: 'WCompUIDrawer',
})

const { closable = false, loading = false, defaultButton = true, showInContent = false, beforeClose } = defineProps<ICompUIDrawerProps>()

const emits = defineEmits<{ yes: [], no: [] }>()

const show = defineModel<boolean>('show', { required: true, default: false })

const { currentRoute } = useAppRouter()

function onNo() {
  emits('no')
}

function onYes() {
  emits('yes')
}

async function onUpdateShow(v: boolean) {
  if (beforeClose) {
    const res = await beforeClose()
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

const getShowInContentProps = computed(() => (showInContent
  ? {
      to: `#${String(currentRoute.value.name)}-content`,
      trapFocus: false,
      blockScroll: false,
    }
  : {}))
</script>

<template>
  <n-drawer
    :show="show"
    native-scrollbar
    :auto-focus="false"
    v-bind="getShowInContentProps"
    @update:show="onUpdateShow"
  >
    <n-drawer-content :native-scrollbar="false" :closable="closable">
      <template #header>
        <WTitle prefix="bar" :help-message="helpMessage">
          {{ title }}
        </WTitle>
      </template>

      <template #default>
        <n-spin :show="loading">
          <slot />
        </n-spin>
      </template>

      <template #footer>
        <slot v-if="$slots.footer" name="footer" />
        <n-space v-else-if="defaultButton" size="small">
          <n-button
            size="small"
            :disabled="loading"
            @click="onUpdateShow(false)"
          >
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
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
