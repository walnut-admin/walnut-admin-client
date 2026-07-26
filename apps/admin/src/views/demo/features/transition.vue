<script lang="ts" setup>
defineOptions({
  name: 'FeatureTransition',
})
</script>

<template>
  <div class="!p-8">
    <n-alert title="Transition" type="info">
      Can be enabled in
      <router-link to="/system/menu" #="{ navigate, href }" custom>
        <n-a :href="href" @click="navigate">
          Menu Management
        </n-a>
      </router-link>
    </n-alert>

    <n-h1>
      This feature supports custom route transition.
    </n-h1>

    <n-h1> Need to config transition true in menu management and global transition mode is global. </n-h1>
  </div>
</template>
