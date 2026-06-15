<script lang="ts" setup>
import type { InputInst } from 'naive-ui'
import type { ICompUIInputProps } from '.'
import { clearIllegalChars, upperFirst } from 'easy-fns-ts'

defineOptions({
  name: 'WCompUIInput',
})

const props = withDefaults(defineProps<ICompUIInputProps>(), {})

const emits = defineEmits<{ click: [e: MouseEvent], keyupEnter: [e: KeyboardEvent] }>()

const inputRef = useTemplateRef<InputInst>('inputRef')

const inputValue = defineModel<string>('value')

function onInputValue(val: string) {
  if (!props.pair) {
    props.blackList?.length && (val = clearIllegalChars(val, props.blackList!))
    props.valueModifiers?.trim && (val = val.trim())
    props.valueModifiers?.capitalize && (val = upperFirst(val))
    props.valueModifiers?.uppercase && (val = val.toLocaleUpperCase())
  }
  inputValue.value = val
}

function onClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  emits('click', e)
}

function onKeyupEnter(e: KeyboardEvent) {
  emits('keyupEnter', e)
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<template>
  <n-input v-model:value="inputValue" @update:value="onInputValue" @click="onClick" @keyup.enter="onKeyupEnter">
    <template #prefix>
      <div v-if="prefix" :class="prefixClass">
        {{ prefix }}
      </div>
      <WIcon v-else-if="prefixIcon" :icon="prefixIcon" />
      <slot v-else name="prefix" />
    </template>

    <template #suffix>
      <div v-if="suffix" :class="suffixClass">
        {{ suffix }}
      </div>
      <WIcon v-else-if="suffixIcon" :icon="suffixIcon" />
      <div v-else-if="copiable" class="flex flex-row flex-nowrap items-center justify-center" @click.prevent.stop>
        <WCopy icon :source="inputValue" />
      </div>
      <WMessage v-else-if="helpMessage" :msg="helpMessage" />
      <slot v-else name="suffix" />
    </template>
  </n-input>
</template>
