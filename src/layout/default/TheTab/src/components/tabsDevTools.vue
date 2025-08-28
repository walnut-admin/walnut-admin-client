<script lang="ts" setup>
import { isDev } from '@/utils/constant/vue'
import { getTabsContext } from '../hooks/useTabsContext'

const appStoreAdapter = useAppStoreAdapter()

const getShowDevTools = computed(() => isDev() && !appStoreAdapter.isMobile)

const { currentMouseTab, devToolShow, onOpenFile } = getTabsContext()
</script>

<template>
  <n-modal v-if="getShowDevTools" v-model:show="devToolShow">
    <n-card style="width: 600px" role="dialog" aria-modal="true">
      <WJSON :value="currentMouseTab" height="300px" />

      <n-button v-show="!currentMouseTab?.meta.url" class="mt-4" @click="onOpenFile">
        <div class="hstack items-center gap-x-2">
          <WMessage
            :msg="[
              'Notice now you have multiple ways to open current file in development environment',
              '1: (best) use vue devtool, the function is built in',
              '2: (nice choice) use turbo console to open the file, the logic behind should be the same as vue devtool, but you need a console in the target file',
              '3: (unnecessary) use vite plugin(i cannot remember the name), which is duplicated with vue devtools function so this project did not install',
            ]"
          />

          <div>
            Open file in
            <span class="text-red-500">VS Code</span>
            (Not recommended)
          </div>
        </div>
      </n-button>
    </n-card>
  </n-modal>
</template>
