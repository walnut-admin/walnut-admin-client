<script lang="ts" setup>
import type { ICompBusinessDictLabelProps } from '.'

defineOptions({
  name: 'WCompBusinessDictLabel',
})

const { dictType, dictValue } = defineProps<ICompBusinessDictLabelProps>()

const { loading, execDict } = useDict(dictType)

const target = computed(() => getDictTarget(dictType, dictValue as string))

async function onInit() {
  if (!dictType) {
    console.warn('WDictLabel', 'need to provide `dictType` prop')
    return
  }
  await execDict()
}

onBeforeMount(onInit)
</script>

<template>
  <n-spin :show="loading" :content-style="{ width: '100% !important' }">
    <template v-if="target">
      <n-tag v-if="target.tagType" :type="target.tagType">
        {{ $t(target.label!) }}
      </n-tag>
      <span v-else>{{ $t(target.label!) }}</span>
    </template>
  </n-spin>
</template>
