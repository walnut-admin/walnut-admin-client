<script lang="ts" setup>
import { enhancedAesGcmLocalStorage, enhancedBase64LocalStorage } from '@/utils/persistent/enhance'
import { removeStorageItemsContaining } from '@/utils/persistent/shared'
import { useAppStorageAsync } from '@/utils/persistent/storage/async'
import { useAppStorageSync } from '@/utils/persistent/storage/sync'
import { getRandomInt } from 'easy-fns-ts'

defineOptions({
  name: 'StorageDemo',
  defaultView: false,
})

const v1 = useAppStorageSync<string>('test-storage-1', 'test-storage-1')
const v2 = useAppStorageSync<string>('test-storage-2', '', { expire: 5 * 1000 })
const v3 = useAppStorageSync<string>('test-storage-3', 'test-storage-3', {
  expire: 5 * 1000,
  ttlMode: 'sliding',
})
const v4 = useAppStorageSync<string>('test-storage-4', '', { expire: 5 * 1000, storage: sessionStorage })
const v5 = useAppStorageSync<string>('test-storage-5', 'test-storage-5', {
  expire: 5 * 1000,
  usePresetKey: false,
})
const v6 = useAppStorageSync<string>('test-storage-6', 'test-storage-6', {
  storage: enhancedBase64LocalStorage(true),
})

const av1 = await useAppStorageAsync<string>('test-storage-11', 'test-storage-11', {
  storage: enhancedAesGcmLocalStorage(true),
})
const av2 = await useAppStorageAsync<string>('test-storage-22', '', {
  storage: enhancedAesGcmLocalStorage(true),
  expire: 5 * 1000,
})
const av3 = await useAppStorageAsync<string>('test-storage-33', 'test-storage-33', {
  storage: enhancedAesGcmLocalStorage(true),
  ttlMode: 'sliding',
  expire: 5 * 1000,
})

const map1 = new Map<string, number>()
map1.set('1', 123)
const m1 = useAppStorageSync<Map<string, number>>('test-map-1', map1)
function onAddToMap1() {
  m1.value.set(`${getRandomInt(0, 99999)}`, getRandomInt(0, 99999))
}
function onClearMap1() {
  m1.value.clear()
}

const map2 = new Map<string, number>()
map2.set('1', 123)
const m2 = useAppStorageSync<Map<string, number>>('test-map-2', map2, { expire: 5 * 1000 })
function onAddToMap2() {
  m2.value.set(`${getRandomInt(0, 99999)}`, getRandomInt(0, 99999))
}
function onClearMap2() {
  m2.value.clear()
}

const map3 = new Map<string, number>()
map3.set('1', 123)
const m3 = useAppStorageSync<Map<string, number>>('test-map-3', map3, { expire: 5 * 1000, ttlMode: 'sliding' })
function onAddToMap3() {
  m3.value.set(`${getRandomInt(0, 99999)}`, getRandomInt(0, 99999))
}
function onClearMap3() {
  m3.value.clear()
}

const map4 = new Map<string, number>()
map4.set('1', 123)
const m4 = useAppStorageSync<Map<string, number>>('test-map-4', map4, { storage: enhancedBase64LocalStorage(true) })
function onAddToMap4() {
  m4.value.set(`${getRandomInt(0, 99999)}`, getRandomInt(0, 99999))
}
function onClearMap4() {
  m4.value.clear()
}

const set1 = new Set<string>()
set1.add('1')
const s1 = useAppStorageSync<Set<string>>('test-set-1', set1)
function onAddToSet1() {
  s1.value.add(`${getRandomInt(0, 99999)}`)
}
function onClearSet1() {
  s1.value.clear()
}

const set2 = new Set<string>()
set2.add('1')
const s2 = useAppStorageSync<Set<string>>('test-set-2', set2, { expire: 5 * 1000 })
function onAddToSet2() {
  s2.value.add(`${getRandomInt(0, 99999)}`)
}
function onClearSet2() {
  s2.value.clear()
}

const set3 = new Set<string>()
set3.add('1')
const s3 = useAppStorageSync<Set<string>>('test-set-3', set3, { expire: 5 * 1000, ttlMode: 'sliding' })
function onAddToSet3() {
  s3.value.add(`${getRandomInt(0, 99999)}`)
}
function onClearSet3() {
  s3.value.clear()
}

const set4 = new Set<string>()
set4.add('1')
const s4 = await useAppStorageAsync<Set<string>>('test-set-4', set4, { storage: enhancedAesGcmLocalStorage(true) })
function onAddToSet4() {
  s4.value?.add(`${getRandomInt(0, 99999)}`)
}
function onClearSet4() {
  s4.value?.clear()
}

onUnmounted(() => {
  removeStorageItemsContaining(localStorage, '__TEST')
  removeStorageItemsContaining(localStorage, 'test-storage-5')
  removeStorageItemsContaining(sessionStorage, '__TEST')
})
</script>

<template>
  <div class="grid grid-cols-2 grid-rows-4 gap-2">
    <div class="col-span-1 row-span-2">
      <WDemoCard class="mb-2" title="Sync Storage" :description="['1. use `useAppStorageSync`', '2. expire in milliseconds', '3. `ttlMode` default `fixed`']">
        <n-list>
          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              Normal LocalStorage
            </WTitle>

            <n-input v-model:value="v1" class="mb-2" />
            <n-text class="mr-2">
              {{ v1 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Expire Fixed TTL (5s)
            </WTitle>

            <n-input v-model:value="v2" class="mb-2" />
            <n-text class="mr-2">
              {{ v2 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2" :help-message="['Slide TTL means change would update extend time']">
              LocalStorage with Expire Slided TTL (5s)
            </WTitle>

            <n-input v-model:value="v3" class="mb-2" />
            <n-text class="mr-2">
              {{ v3 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              SessionStorage with Expire Fixed TTL (5s)
            </WTitle>

            <n-input v-model:value="v4" class="mb-2" />
            <n-text class="mr-2">
              {{ v4 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with No Prefix key
            </WTitle>

            <n-input v-model:value="v5" class="mb-2" />
            <n-text class="mr-2">
              {{ v5 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Base64 Encode
            </WTitle>

            <n-input v-model:value="v6" class="mb-2" />
            <n-text class="mr-2">
              {{ v6 }}
            </n-text>
          </n-list-item>
        </n-list>
      </WDemoCard>

      <WDemoCard title="Map">
        <n-list>
          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Map Support
            </WTitle>

            <n-button class="mb-2" @click="onAddToMap1">
              Add to map ({{ m1.size }})
            </n-button>

            <n-button class="mb-2" @click="onClearMap1">
              Clear map
            </n-button>
            <br>
            <n-text>
              {{ m1 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Map Support & Expire Fixed TTL (5s)
            </WTitle>

            <n-button class="mb-2" @click="onAddToMap2">
              Add to map ({{ m2.size }})
            </n-button>

            <n-button class="mb-2" @click="onClearMap2">
              Clear map
            </n-button>
            <br>
            <n-text>
              {{ m2 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Map Support & Expire Slided TTL (5s)
            </WTitle>

            <n-button class="mb-2" @click="onAddToMap3">
              Add to map ({{ m3.size }})
            </n-button>

            <n-button class="mb-2" @click="onClearMap3">
              Clear map
            </n-button>
            <br>
            <n-text>
              {{ m3 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Map Support & Base64 Encode
            </WTitle>

            <n-button class="mb-2" @click="onAddToMap4">
              Add to map ({{ m4.size }})
            </n-button>

            <n-button class="mb-2" @click="onClearMap4">
              Clear map
            </n-button>
            <br>
            <n-text>
              {{ m4 }}
            </n-text>
          </n-list-item>
        </n-list>
      </WDemoCard>
    </div>

    <div class="col-span-1 row-span-2">
      <WDemoCard class="mb-2" title="Async Storage" :description="['1. need indexDB support', '2. need to use `useAppStorageAsync` instead', '3. need to use await on `useAppStorageAsync`']">
        <n-list>
          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with AES GCM Encrypt
            </WTitle>

            <n-input v-model:value="av1" class="mb-2" />
            <n-text class="mr-2">
              {{ av1 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with AES GCM Encrypt and Expire Fixed TTL (5s)
            </WTitle>

            <n-input v-model:value="av2" class="mb-2" />
            <n-text class="mr-2">
              {{ av2 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with AES GCM Encrypt and Expire Slided TTL (5s)
            </WTitle>

            <n-input v-model:value="av3" class="mb-2" />
            <n-text class="mr-2">
              {{ av3 }}
            </n-text>
          </n-list-item>
        </n-list>
      </WDemoCard>

      <WDemoCard title="Set">
        <n-list>
          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Set Support
            </WTitle>

            <n-button class="mb-2" @click="onAddToSet1">
              Add to set ({{ s1.size }})
            </n-button>

            <n-button class="mb-2" @click="onClearSet1">
              Clear set
            </n-button>
            <br>
            <n-text>
              {{ s1 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Set Support & Expire Fixed TTL (5s)
            </WTitle>

            <n-button class="mb-2" @click="onAddToSet2">
              Add to set ({{ s2.size }})
            </n-button>

            <n-button class="mb-2" @click="onClearSet2">
              Clear set
            </n-button>
            <br>
            <n-text>
              {{ s2 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Set Support & Expire Slided TTL (5s)
            </WTitle>

            <n-button class="mb-2" @click="onAddToSet3">
              Add to set ({{ s3.size }})
            </n-button>

            <n-button class="mb-2" @click="onClearSet3">
              Clear set
            </n-button>
            <br>
            <n-text>
              {{ s3 }}
            </n-text>
          </n-list-item>

          <n-list-item>
            <WTitle prefix="bar" class="mb-2">
              LocalStorage with Set Support & AES GCM Encrypt
            </WTitle>

            <n-button class="mb-2" @click="onAddToSet4">
              Add to set ({{ s4.size }})
            </n-button>

            <n-button class="mb-2" @click="onClearSet4">
              Clear set
            </n-button>
            <br>
            <n-text>
              {{ s4 }}
            </n-text>
          </n-list-item>
        </n-list>
      </WDemoCard>
    </div>
  </div>
</template>
