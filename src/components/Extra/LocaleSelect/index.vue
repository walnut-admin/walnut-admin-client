<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'
import type { ICompExtraLocaleSelectProps } from '.'

defineOptions({
  name: 'WCompExtraLocaleSelect',
})

const { prefix, presetKey, creatable = true, refreshable = true } = defineProps<ICompExtraLocaleSelectProps>()
const value = defineModel<string | null | undefined>('value', { required: true })

const { locale, messages } = useAppI18n()
const loading = ref(false)
const show = ref(false)

const options = computed(() =>
  Object.entries<any>(messages.value[`${locale.value}`])
    .map(([k, v]) => {
      if (!prefix || k.startsWith(prefix!))
        return { value: k, label: v }

      return { value: undefined, label: undefined }
    })
    .filter(i => i.value),
)

function onRenderLabel(option: SelectOption) {
  if (option.value) {
    return `${option.label} (${option.value})`
  }
}

async function onNewLocale() {
  // The name below need to match locale management name field which is fetch from backend
  await useAppRouterPush({ name: 'Locale', query: { localeKey: presetKey } })
}

async function onRefresh() {
  loading.value = true

  try {
    const appStoreLocale = useAppStoreLocale()

    await appStoreLocale.onLoadMessageNoCache(appStoreLocale.getLocale)
  }
  finally {
    loading.value = false
  }
}

onDeactivated(() => {
  show.value = false
})
</script>

<template>
  <WSelect
    v-model:show="show"
    v-model:value="value!"
    :options="options"

    :render-label="onRenderLabel"
    clearable filterable tooltip
    :tooltip-props="{
      placement: 'right',
    }"
  >
    <template #action>
      <n-space>
        <WButton v-if="creatable" size="small" icon="ant-design:plus-outlined" @click="onNewLocale">
          {{ $t('app.base.create') }}
        </WButton>

        <WButton
          v-if="refreshable"
          size="small" icon="ant-design:sync-outlined" :loading="loading" :disabled="loading"
          @click="onRefresh"
        >
          {{ $t('app.base.refresh') }}
        </WButton>
      </n-space>
    </template>
  </WSelect>
</template>
