<script lang="tsx" setup>
import type { ICompUIButtonProps } from '.'

defineOptions({
  name: 'WCompUIButton',
})

const { debounce = 100, textProp } = defineProps<ICompUIButtonProps>()

const emits = defineEmits<{ click: [e: MouseEvent] }>()

const userStorePermission = useAppStoreUserPermission()

function onClick(e: MouseEvent) {
  emits('click', e)
}

const debounceClick = useDebounceFn(onClick, debounce)

const onFinalClick = (e: MouseEvent) => debounce ? debounceClick(e) : onClick(e)

const ButtonText = () => textProp && (typeof textProp === 'string' ? textProp : textProp())
</script>

<template>
  <n-button v-if="!auth || auth && userStorePermission.hasPermission(auth)" @click="onFinalClick">
    <template #default>
      <ButtonText v-if="textProp" />
      <slot v-else name="default" />
    </template>

    <template #icon>
      <WIcon v-if="icon" :icon="icon" />
      <slot v-else name="icon" />
    </template>
  </n-button>
</template>
