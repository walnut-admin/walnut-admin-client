<script lang="ts" setup>
defineOptions({
  name: 'AuthorizeDemo',
  defaultView: false,
})

const p1 = 'some:strange:permission:string'
const p2 = 'some:strange:permission:string2'
const p3 = 'some:strange:permission:string3'

const p3show = ref(true)

const userStorePermission = useAppStoreUserPermission()

function onToggle(s: string) {
  userStorePermission.togglePermission(s)
}

function onReset() {
  p3show.value = false
  nextTick(() => {
    p3show.value = true
  })
}
</script>

<template>
  <WDemoCard title="Authorize Component">
    <n-list>
      <n-list-item>
        <WTitle
          class="mb-2"
          prefix="bar"
          help-message="Use permission string to controll element visibility, quite simple"
        >
          `null` preset
        </WTitle>

        <br>

        <WJSON height="70px" :value="{ permission1: p1 }" />

        <br>

        <n-text> Below is something you can see </n-text>
        <br>
        <WAppAuthorize value="system:user:list">
          <n-text type="primary">
            This is something you can see
          </n-text>
        </WAppAuthorize>

        <br>

        <n-text> Below is something you can't see </n-text>
        <n-button text type="info" @click="onToggle(p1)">
          Toggle
        </n-button>
        <br>
        <WAppAuthorize :value="p1">
          <n-text type="primary">
            This is something you can't see
          </n-text>
        </WAppAuthorize>
      </n-list-item>

      <n-list-item>
        <WTitle
          class="mb-2"
          prefix="bar"
          help-message="Show a tip to tell user that you do not have permission on this module \n Need to provide a `preset-width` and `preset-height` to hold the container"
        >
          `tip` preset
        </WTitle>

        <br>

        <WJSON height="70px" :value="{ permission2: p2 }" />

        <br>

        <n-button text type="info" @click="onToggle(p2)">
          Toggle
        </n-button>

        <br>

        <WAppAuthorize
          :value="p2"
          preset="tip"
          preset-width="200px"
          preset-height="200px"
        >
          <div
            :style="{
              height: '200px',
              width: '200px',
            }"
            class="flex items-center justify-center bg-yellow-100 text-center text-blue-900"
          >
            this is the content that you can't see
          </div>
        </WAppAuthorize>
      </n-list-item>

      <n-list-item>
        <WTitle
          class="mb-2"
          prefix="bar"
          help-message="Show a input for user to confirm the permission string \n Need to provide a `preset-width` and `preset-height` to hold the container"
        >
          `input-permission-to-confirm` preset
        </WTitle>

        <br>

        <WJSON height="70px" :value="{ permission3: p3 }" />

        <br>

        <n-button text type="info" @click="onReset">
          Reset
        </n-button>

        <WAppAuthorize
          v-if="p3show"
          :value="p3"
          preset="IPTC"
          preset-width="400px"
          preset-height="400px"
        >
          <div
            :style="{
              height: '400px',
              width: '400px',
            }"
            class="flex items-center justify-center bg-yellow-100 text-center text-blue-900"
          >
            this is the content that you won't see if you do not enter the right
            permission code
          </div>
        </WAppAuthorize>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
