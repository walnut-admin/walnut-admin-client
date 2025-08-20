<script lang="ts" setup>
import { enhancedAesGcmLocalStorage, enhancedBase64LocalStorage } from '@/utils/persistent/enhance'
import { useAppStorageAsync } from '@/utils/persistent/storage/async'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'

defineOptions({
  name: 'StorageDemo',
  defaultView: false,
})

const s1 = useAppStorageSync('test-storage-1', 'test-storage-1')
const s2 = useAppStorageSync('test-storage-2', 'test-storage-2', { expire: 5 * 1000 })
const s3 = useAppStorageSync('test-storage-3', 'test-storage-3', {
  expire: 5 * 1000,
  ttlMode: 'sliding',
})
const s4 = useAppStorageSync('test-storage-4', 'test-storage-4', { expire: 5 * 1000, storage: sessionStorage })
const s5 = useAppStorageSync('test-storage-5', 'test-storage-5', {
  expire: 5 * 1000,
  usePresetKey: false,
})
const s6 = useAppStorageSync('test-storage-6', 'test-storage-6', {
  storage: enhancedBase64LocalStorage(true),
})

const ss1 = await useAppStorageAsync('test-storage-11', 'test-storage-11', {
  storage: enhancedAesGcmLocalStorage(true),
})
const ss2 = await useAppStorageAsync('test-storage-22', 'test-storage-22', {
  storage: enhancedAesGcmLocalStorage(true),
  expire: 5 * 1000,
})
const ss3 = await useAppStorageAsync('test-storage-33', 'test-storage-33', {
  storage: enhancedAesGcmLocalStorage(true),
  ttlMode: 'sliding',
  expire: 5 * 1000,
})
</script>

<template>
  <div class="flex flex-row flex-nowrap gap-x-2">
    <WDemoCard class="w-full" title="Sync Storage" :description="['1. use `useAppStorageSync`', '2. expire in milliseconds', '3. `ttlMode` default `fixed`']">
      <n-list>
        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            Normal LocalStorage
          </WTitle>

          <n-input v-model:value="s1" class="mb-2" />
          <n-text class="mr-2">
            {{ s1 }}
          </n-text>
        </n-list-item>

        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            LocalStorage with Expire Fixed TTL (5s)
          </WTitle>

          <n-input v-model:value="s2" class="mb-2" />
          <n-text class="mr-2">
            {{ s2 }}
          </n-text>
        </n-list-item>

        <n-list-item>
          <WTitle prefix="bar" class="mb-2" :help-message="['Slide TTL means change would update extend time']">
            LocalStorage with Expire Slided TTL (5s)
          </WTitle>

          <n-input v-model:value="s3" class="mb-2" />
          <n-text class="mr-2">
            {{ s3 }}
          </n-text>
        </n-list-item>

        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            SessionStorage with Expire Fixed TTL (5s)
          </WTitle>

          <n-input v-model:value="s4" class="mb-2" />
          <n-text class="mr-2">
            {{ s4 }}
          </n-text>
        </n-list-item>

        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            LocalStorage with No Prefix key
          </WTitle>

          <n-input v-model:value="s5" class="mb-2" />
          <n-text class="mr-2">
            {{ s5 }}
          </n-text>
        </n-list-item>

        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            LocalStorage with Base64 Encode
          </WTitle>

          <n-input v-model:value="s6" class="mb-2" />
          <n-text class="mr-2">
            {{ s6 }}
          </n-text>
        </n-list-item>
      </n-list>
    </WDemoCard>

    <WDemoCard class="w-full" title="Async Storage" :description="['1. need indexDB support', '2. need to use `useAppStorageAsync` instead', '3. need to use await on `useAppStorageAsync`']">
      <n-list>
        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            LocalStorage with AES GCM Encrypt
          </WTitle>

          <n-input v-model:value="ss1" class="mb-2" />
          <n-text class="mr-2">
            {{ ss1 }}
          </n-text>
        </n-list-item>

        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            LocalStorage with AES GCM Encrypt and Expire Fixed TTL (5s)
          </WTitle>

          <n-input v-model:value="ss2" class="mb-2" />
          <n-text class="mr-2">
            {{ ss2 }}
          </n-text>
        </n-list-item>

        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            LocalStorage with AES GCM Encrypt and Expire Slided TTL (5s)
          </WTitle>

          <n-input v-model:value="ss3" class="mb-2" />
          <n-text class="mr-2">
            {{ ss3 }}
          </n-text>
        </n-list-item>
      </n-list>
    </WDemoCard>
  </div>
</template>
