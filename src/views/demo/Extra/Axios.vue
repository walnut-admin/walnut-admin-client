<script lang="ts" setup>
import type { AxiosRequestConfig } from 'axios'
import { HelloAPI, HelloWithTokenAPI } from '@/api'
import { removeAllCancel, removeLatestRequest } from '@/utils/axios/adapters/cancel'

defineOptions({
  name: 'AxiosDemo',
  defaultView: false,
})

const withToken = ref(true)

async function _request(payload?: AxiosRequestConfig) {
  if (withToken.value) {
    const res = await HelloWithTokenAPI(payload!)
    useAppMsgSuccess(res)
  }
  else {
    const res = await HelloAPI(payload!)
    useAppMsgSuccess(res)
  }
}

const pool: Record<number, Fn> = {
  1: () => {
    _request()
  },
  2: () => {
    _request({ _cache: true })
  },
  3: () => {
    _request({ _throttle: 1000 })
  },
  4: () => {
    _request({ _retryTimes: 3, _error: true })
  },
  5: () => {
    _request({ _timestamp: true })
  },
  6: () => {
    _request({ _carryToken: false })
  },
  8: () => {
    _request({ _sleep: 2000 })
  },
  9: () => {
    _request({ _sleep: 1000 })
    _request({ _sleep: 3000 })
    _request({ _sleep: 5000 })

    const id = setTimeout(() => {
      removeLatestRequest()
      clearTimeout(id)
    }, 500)
  },
  10: () => {
    for (let i = 0; i < 10; i++) {
      const id = setTimeout(async () => {
        await _request({ _sleep: i * 1000, _timestamp: true })
        clearTimeout(id)
      }, i * 100)
    }

    const id = setTimeout(() => {
      removeAllCancel()
      clearTimeout(id)
    }, 2500)
  },
  11: () => {
    _request({ _mergeRequest: true, params: { t: 1, q: 1 } })
    _request({ _mergeRequest: true, params: { t: 2, q: 2 } })
    _request({ _mergeRequest: true, params: { t: 3, q: 3 } })
    _request({ _mergeRequest: true, params: { t: 4, q: 4 } })
    _request({ _mergeRequest: true, params: { t: 5, q: 5 } })
    _request({ _mergeRequest: true, params: { t: 6, q: 6 } })
    _request({ _mergeRequest: true, params: { t: 7, q: 7 } })
    _request({ _mergeRequest: true, params: { t: 8, q: 8 } })
  },
}

function onSend(type: number) {
  pool[type]()
}

const items = [
  {
    value: true,
    label: 'Auth Needed',
  },
  {
    value: false,
    label: 'Public API',
  },
]
</script>

<template>
  <WDemoCard title="Axios (See network tab)">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Send request with custum config
        </WTitle>

        <n-radio-group v-model:value="withToken" name="radiogroup">
          <n-space>
            <n-radio v-for="item in items" :key="`${item.value}`" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>

        <br>

        <n-button-group vertical size="large">
          <n-button @click="onSend(1)">
            Send Request normally
          </n-button>
          <n-button @click="onSend(2)">
            Send Request with cache support
          </n-button>
          <n-button @click="onSend(3)">
            Send Request with throttle support (only GET method)
          </n-button>
          <n-button @click="onSend(4)">
            Send Request with retry support
          </n-button>
          <n-button @click="onSend(5)">
            Send Request with timestamp query
          </n-button>
          <n-button @click="onSend(6)">
            Send Request with not carry token
          </n-button>
          <n-button @click="onSend(8)">
            Send Request with sleep miliseconds(endpoint support)
          </n-button>
          <n-button @click="onSend(9)">
            Send Request with cancel support
          </n-button>
          <n-button @click="onSend(10)">
            Send Request with batch cancel support
          </n-button>
          <n-button @click="onSend(11)">
            Send Same Request Same time
          </n-button>
        </n-button-group>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
