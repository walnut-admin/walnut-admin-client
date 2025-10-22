<script lang="ts" setup>
import type { IModels } from '@/api/models'
import { deviceAPI } from '@/api/system/device'
import DeviceCard from './card.vue'

defineOptions({
  name: 'Device',
})

const data = ref<IModels.SystemDevice[]>([])
const loading = ref(false)

async function init() {
  try {
    const res = await deviceAPI.list({ page: { page: 1, pageSize: 8 }, sort: [{ field: 'active', order: 'descend', priority: 1 }] })
    data.value = res.data
  }
  finally {
    loading.value = false
  }
}

function onDetail(id?: string) {
  console.log(id)
}

useKeepAliveEffect(() => {
  init()
})
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
  >
    <DeviceCard
      v-for="device in data"
      :key="device._id"
      :device="device"
      @detail="onDetail"
    />
  </div>
</template>
