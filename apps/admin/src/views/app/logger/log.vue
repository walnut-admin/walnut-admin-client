<script lang="ts" setup>
import { readAppLoggerMoreAPI } from '@/api/app/logger'

// TODO fucking disaster
defineOptions({
  name: 'AppLoggerLog',
})

const props = withDefaults(defineProps<Props>(), {
  pageSize: 30,
})

interface Props {
  keyField: string
  formData: Record<string, any>
  pageSize?: number
}

const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)

async function handleReachBottom() {
  const key = props.keyField
  const formData = props.formData

  if (!formData[key] || loading.value || !hasMore.value)
    return

  page.value += 1
  loading.value = true

  try {
    const newContent = await readAppLoggerMoreAPI(formData[key], page.value)
    if (newContent.fileContent?.length) {
      formData.fileContent.push(...newContent.fileContent)
    }
    else if (
      newContent.fileContent?.length === 0
      || (newContent.fileContent?.length as number) < props.pageSize
    ) {
      hasMore.value = false
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <n-log
    class="h-full w-full"
    language="nix"
    :rows="20"
    :loading="loading"
    :lines="props.formData.fileContent"
    @reach-bottom="handleReachBottom"
  />
</template>
