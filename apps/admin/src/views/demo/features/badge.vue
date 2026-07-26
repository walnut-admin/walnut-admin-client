<script lang="ts" setup>
defineOptions({
  name: 'FeatureBadge',
})
</script>

<template>
  <div class="!p-8">
    <n-alert title="Custom Badge" type="info">
      Can be enabled in
      <router-link to="/system/menu" #="{ navigate, href }" custom>
        <n-a :href="href" @click="navigate">
          Menu Management
        </n-a>
      </router-link>
    </n-alert>

    <n-h1> This feature supports custom badge after the title in menu. </n-h1>

    <n-h1>
      Maybe normally used for tagging a `new` module online or `hot` module that
      most user using
    </n-h1>
  </div>
</template>
