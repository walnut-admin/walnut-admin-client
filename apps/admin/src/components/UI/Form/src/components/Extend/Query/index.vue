<script lang="ts" setup generic="T">
import type { ICompUIFormItemExtendQueryProps } from '.'
import { useFormContext } from '../../../hooks/useFormContext'

defineOptions({
  name: 'WFormItemExtendQuery',
})

const props = defineProps<ICompUIFormItemExtendQueryProps>()

const { t } = useAppI18n()

const active = defineModel<boolean>('active', { required: true })

const getText = computed(() => active.value ? t('app.base.expand') : t('app.base.collapse'))

const { formEvent, formSchemas, formItemIdCtx, formPropsCtx } = useFormContext<T>()

const { setProps, getProps } = formPropsCtx

function done() {
  setProps({ disabled: false })
}

function onFormReset() {
  setProps({ disabled: true })
  formEvent('reset', { done })
}

function onQuery() {
  setProps({ disabled: true })
  formEvent('query', { done })
}

function onToggle() {
  active.value = !active.value

  for (let i = props.countToFold!; i < formSchemas.value.length; i++) {
    const item = formSchemas.value[i]

    formItemIdCtx.toggleFormItemId(item, i)
  }
}

onMounted(() => {
  if (props.defaultFold)
    onToggle()
})
</script>

<template>
  <n-space :wrap="false" size="small">
    <n-button
      size="small"
      type="primary"
      :disabled="getProps.disabled"
      :loading="getProps.disabled"
      @click="onQuery"
    >
      <template #default>
        {{ t('app.base.search') }}
      </template>
      <template #icon>
        <WIcon icon="ant-design:search-outlined" />
      </template>
    </n-button>

    <n-button
      size="small"
      type="info"
      :disabled="getProps.disabled"
      @click="onFormReset"
    >
      <template #default>
        {{ t('app.base.reset') }}
      </template>
      <template #icon>
        <WIcon icon="carbon:reset" />
      </template>
    </n-button>

    <n-button
      v-if="foldable"
      size="small"
      type="default"
      icon-placement="right"
      :disabled="getProps.disabled"
      @click="onToggle"
    >
      <template #default>
        {{ getText }}
      </template>
      <template #icon>
        <WArrow :active="!active" class="mt-0.5" />
      </template>
    </n-button>
  </n-space>
</template>
