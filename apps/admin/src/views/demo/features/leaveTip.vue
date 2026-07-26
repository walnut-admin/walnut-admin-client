<script lang="ts" setup>
defineOptions({
  name: 'FeatureLeaveTip',
})
</script>

<template>
  <div class="!p-8">
    <n-alert title="LeaveTip" type="info">
      Can be enabled in
      <router-link to="/system/menu" #="{ navigate, href }" custom>
        <n-a :href="href" @click="navigate">
          Menu Management
        </n-a>
      </router-link>
    </n-alert>

    <n-alert title="Notice" type="warning" class="mt-2">
      Notice `beforeunload` won't trigger if the user has no interact with the page.
      This is designed so, see at
      <n-a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#security" target="_blank">
        here
      </n-a>
    </n-alert>

    <n-h1>
      This feature supports when user try to leave this page or going to other
      page, system will call a confirm function to ask for leave permission.
    </n-h1>

    <n-h1>
      Maybe normally used for a form detail page or some important page that
      need user to go thourgh.
    </n-h1>

    <n-h1>
      Also add the support for browser leave tip, which is achieved by vueuse
      <n-text type="info">
        `useEventListener('beforeunload')`.
      </n-text>
    </n-h1>

    <n-h1>
      Since used `beforeunload` event, i didn't separate the difference for refresh and close the browser tab.
      So when refresh the current page, you will also get a browser-level tip.
    </n-h1>
  </div>
</template>
