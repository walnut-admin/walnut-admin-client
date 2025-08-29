<script lang="ts" setup>
import { openExternalLink } from '@/utils/window/open'

defineOptions({
  name: 'ExternalLink',
})

const { currentRoute } = useAppRouter()

const appStoreBackendSettings = useAppStoreSettingBackend()

function onClick() {
  const url = currentRoute.value.query.url as string

  if (!url)
    return

  openExternalLink(url, false, '_self')
}
</script>

<template>
  <div
    class="relative h-screen w-screen flex items-center justify-center bg-bodyColor"
  >
    <div class="mx-auto w-full md:w-1/3">
      <div class="flex flex-col rounded-lg p-5 shadow shadow-2xl">
        <div class="flex flex-col items-center text-center">
          <div class="inline-block rounded-full bg-yellow-50 p-4">
            <svg
              class="h-12 w-12 fill-current text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"
              />
            </svg>
          </div>

          <n-h2 class="mb-2 mt-2 font-semibold">
            {{ $t('app.route.externalLink.title1') }}
          </n-h2>

          <n-h2 class="mb-2 mt-2 text-sm">
            {{ $t('app.route.externalLink.title2') }}
          </n-h2>

          <div
            class="mt-2 hstack items-center gap-2 border-1 border-gray-400 rounded-lg p-3"
          >
            <div
              class="h-10 w-10 hstack items-center justify-center rounded-lg bg-gray-200"
            >
              <WIcon icon="ant-design:link-outlined" height="24" />
            </div>
            <div class="text-info tracking-wide">
              {{ $route.query.url }}
            </div>
          </div>
        </div>

        <div class="mt-3 flex items-center justify-center">
          <n-button type="warning" @click="onClick">
            <span class="mx-6 tracking-wider">
              {{ $t('app.route.externalLink.button') }}
            </span>
          </n-button>
        </div>
      </div>
    </div>

    <div
      class="absolute right-8 top-8 z-50 hstack children:cursor-pointer space-x-4"
    >
      <n-button text>
        <WAppLocalePicker v-if="appStoreBackendSettings.getLocaleEnabled" />
      </n-button>
      <n-button text>
        <WAppDarkMode v-if="appStoreBackendSettings.getDarkEnabled" />
      </n-button>
    </div>
  </div>
</template>
