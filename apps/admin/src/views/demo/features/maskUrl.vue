<script lang="ts" setup>
defineOptions({
  name: 'FeatureMaskUrl',
})

const q1 = useRouterQuery('q1', '1111')
const q2 = useRouterQuery('q2')
const q3 = useRouterQuery('q3')
</script>

<template>
  <div class="p-4">
    <WDemoCard title="Mask Browser Url">
      <n-list>
        <n-list-item>
          <n-alert type="info">
            Can be config in
            <router-link to="/system/menu" #="{ navigate, href }" custom>
              <n-a :href="href" @click="navigate">
                Menu Management
              </n-a>
            </router-link>
          </n-alert>
        </n-list-item>

        <n-list-item>
          <n-h1>
            This feature supports mask browser url, including `path`/`query`/`params`.
          </n-h1>

          <n-h1> `Path` mask is based on `fflate` & `js-base64`. </n-h1>

          <n-h1>
            `Query` & `Params` need api aes key support.
          </n-h1>
        </n-list-item>

        <n-list-item>
          <WTitle prefix="bar" class="mb-2">
            Dynamic Query
          </WTitle>

          <n-space>
            <n-input v-model:value="q1" />
            <n-input v-model:value="q2" />
            <n-input v-model:value="q3" />
          </n-space>
        </n-list-item>
      </n-list>
    </WDemoCard>
  </div>
</template>
