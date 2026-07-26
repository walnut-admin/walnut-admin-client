<script lang="ts" setup>
defineOptions({
  name: 'ErrorDemo',
  defaultView: false,
})

const triggerRenderError = ref(false)

function throwJsError() {
  throw new Error('Sentry Test: Regular JS Runtime Error')
}

function throwDomEventError() {
  throw new Error('Sentry Test: DOM Event Error')
}

function throwTimeoutError() {
  setTimeout(() => {
    throw new Error('Sentry Test: setTimeout Error')
  }, 0)
}

function throwIntervalError() {
  const id = setInterval(() => {
    clearInterval(id)
    throw new Error('Sentry Test: setInterval Error')
  }, 1000)
}

function throwUnhandledPromise() {
  Promise.reject(new Error('Sentry Test: Unhandled Promise Rejection'))
}

async function request404() {
  await fetch('https://jsonplaceholder.typicode.com/not-exists')
}

function throwTypeError() {
  const obj: any = null
  obj.foo.bar = 1
}

function stackOverflow() {
  function recurse() {
    recurse()
  }
  recurse()
}
</script>

<template>
  <WDemoCard title="Error Manupilation">
    <n-space wrap>
      <n-button type="error" @click="throwJsError">
        Throw JS Error
      </n-button>
      <n-button type="error" @click="throwUnhandledPromise">
        Unhandled Promise
      </n-button>
      <n-button type="error" @click="request404">
        Request 404
      </n-button>
      <n-button type="error" @click="throwTypeError">
        TypeError
      </n-button>
      <n-button type="error" @click="stackOverflow">
        Stack Overflow
      </n-button>
      <n-button type="error" @click="throwDomEventError">
        Click me for DOM Event Error
      </n-button>
      <n-button type="error" @click="triggerRenderError = true">
        Vue Render Error
      </n-button>
      <n-button type="error" @click="throwTimeoutError">
        setTimeout Error
      </n-button>
      <n-button type="error" @click="throwIntervalError">
        setInterval Error
      </n-button>
    </n-space>

    <img src="https://example.com/not-exist.png">

    <div v-if="triggerRenderError">
      <!-- @vue-expect-error error demo -->
      {{ undefinedVariable.foo }}
    </div>
  </WDemoCard>
</template>
