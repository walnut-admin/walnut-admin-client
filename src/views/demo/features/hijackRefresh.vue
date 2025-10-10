<script lang="ts" setup>
defineOptions({
  name: 'FeatureHijackRefresh',
})
</script>

<template>
  <div class="!p-8">
    <n-alert title="Hijack Refresh" type="info">
      Can be enabled in
      <router-link to="/system/menu" #="{ navigate, href }" custom>
        <n-a :href="href" @click="navigate">
          Menu Management
        </n-a>
      </router-link>
    </n-alert>

    <n-h1>
      This feature supports scope F5 hijack refresh.
    </n-h1>

    <n-h1> Redirect supported </n-h1>
  </div>
</template>
