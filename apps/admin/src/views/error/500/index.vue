<script lang="ts" setup>
defineOptions({
  name: 'App500',
})

const { t } = useAppI18n()

function onClick() {
  useAppMessage().warning(t('app.base.wip'))
}
</script>

<template>
  <div class="h-screen w-full flex items-center justify-center bg-bodyColor p-5">
    <div class="text-center">
      <div class="inline-flex rounded-full bg-red-100 p-4">
        <div class="rounded-full bg-red-200 stroke-red-600 p-4">
          <svg
            class="h-16 w-16"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8H6.01M6 16H6.01M6 12H18C20.2091 12 22 10.2091 22 8C22 5.79086 20.2091 4 18 4H6C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12ZM6 12C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20H14"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17 16L22 21M22 16L17 21"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <h1 class="mt-5 text-[36px] font-bold lg:text-[50px]">
        500 - {{ $t('app.500.title1') }}
      </h1>
      <p class="mt-5 whitespace-pre-wrap lg:text-lg">
        {{ $t('app.500.title2') }}
      </p>
      <n-button class="mt-5" type="warning" @click="onClick">
        {{ $t('app.500.button') }}
      </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
