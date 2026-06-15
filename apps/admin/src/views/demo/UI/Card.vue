<script lang="ts" setup>
defineOptions({
  name: 'CardDemo',
  defaultView: false,
})

const show = ref(true)

function onRefresh() {
  show.value = false

  const id = setTimeout(() => {
    show.value = true
    clearTimeout(id)
  }, 1000)
}
</script>

<template>
  <WDemoCard title="Card">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Card
        </WTitle>

        <n-space>
          <WCard class="w-64">
            <template #header>
              title
            </template>

            <div>
              this is normal card
            </div>
          </WCard>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Card collapsed
        </WTitle>

        <n-space>
          <WCard header-preset="collapse" class="w-64">
            <template #header>
              title
            </template>

            <div>
              this is collapsed card
            </div>
          </WCard>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Card With Refresh
        </WTitle>

        <n-space>
          <WCard header-preset="refresh" class="w-64" @refresh="onRefresh">
            <template #header>
              title
            </template>

            <div v-show="show" class="w-64">
              this is refresh card
            </div>
          </WCard>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Card loading
        </WTitle>

        <n-space>
          <WCard header-preset="refresh" loading class="w-64">
            <template #header>
              title
            </template>

            <div>
              this is loading card
            </div>
          </WCard>
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>

<style lang="scss" scoped>

</style>
