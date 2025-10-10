<script lang="ts" setup>
defineOptions({
  name: 'FeatureWatermark',
})
</script>

<template>
  <div class="!p-8">
    <n-alert title="Watermark" type="info">
      Can be enabled in
      <router-link to="/system/menu" #="{ navigate, href }" custom>
        <n-a :href="href" @click="navigate">
          Menu Management
        </n-a>
      </router-link>
    </n-alert>

    <n-h1>
      This feature supports custom route watermark.
    </n-h1>

    <n-h1> Need to config watermark in menu management and global watermark mode is global. </n-h1>
  </div>
</template>
