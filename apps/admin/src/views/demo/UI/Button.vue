<script setup lang="ts">
defineOptions({
  name: 'ButtonDemo',
  defaultView: false,
})

const value = ref(0)

const buttonRetryRef1 = shallowRef()
const buttonRetryRef2 = shallowRef()
const buttonRetryRef3 = shallowRef()

function onClick() {
  value.value++
}
</script>

<template>
  <WDemoCard :title="`Button: ${value}`">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Text in slot/prop
        </WTitle>

        <n-space>
          <WButton @click="onClick">
            Click(slot)
          </WButton>
          <WButton text-prop="Click(prop)" @click="onClick" />
          <WButton text-prop="loading" loading @click="onClick" />
          <WButton text-prop="disabled" disabled @click="onClick" />
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Icon(prop)
        </WTitle>

        <n-space>
          <WButton
            type="primary"
            icon="ant-design:home-outlined"
            @click="onClick"
          >
            Icon prop
          </WButton>
          <WButton
            type="primary"
            loading
            icon="ant-design:home-outlined"
            @click="onClick"
          >
            loading
          </WButton>
          <WButton
            type="primary"
            disabled
            icon="ant-design:home-outlined"
            @click="onClick"
          >
            disabled
          </WButton>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Debounece Button
        </WTitle>

        <n-space>
          <WButton type="warning" :debounce="500" @click="onClick">
            Debouned 500ms
          </WButton>

          <WButton type="warning" :debounce="500" loading @click="onClick">
            loading
          </WButton>

          <WButton type="warning" :debounce="500" disabled @click="onClick">
            disabled
          </WButton>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Confirm Button
        </WTitle>

        <n-space>
          <WButtonConfirm @confirm="onClick">
            Confirm Button
          </WButtonConfirm>

          <WButtonConfirm :button-props="{ type: 'error', loading: true }" :show-icon="false" @confirm="onClick">
            loading
          </WButtonConfirm>

          <WButtonConfirm :button-props="{ disabled: true }" @confirm="onClick">
            disabled
          </WButtonConfirm>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Retry Button
        </WTitle>

        <n-space>
          <WButtonRetry ref="buttonRetryRef1" @click="buttonRetryRef1.onStartCountdown()">
            Retry 60s
          </WButtonRetry>

          <WButtonRetry ref="buttonRetryRef2" :retry-seconds="30" @click="buttonRetryRef2.onStartCountdown()">
            Retry 30s
          </WButtonRetry>

          <WButtonRetry ref="buttonRetryRef3" retry-key="demo-button-retry" :retry-seconds="30" @click="buttonRetryRef3.onStartCountdown()">
            Retry with storage persistent
          </WButtonRetry>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Button Groups
        </WTitle>

        <WButtonGroup
          :groups="[
            { textProp: 'Button 1', onClick },
            { textProp: 'Button 2', onClick },
            { textProp: 'Button 3', onClick },
          ]"
        />

        <WButtonGroup
          vertical
          :groups="[
            { textProp: 'Button 1', onClick },
            { textProp: 'Button 2', onClick },
            { textProp: 'Button 3', onClick },
          ]"
        />
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
