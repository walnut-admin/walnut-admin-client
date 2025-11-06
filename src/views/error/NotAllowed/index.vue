<script lang="ts" setup>
defineOptions({
  name: 'AppErrorNotAllowed',
})

const type = useRouterQuery('type')

function onContactAdmin() {
  useAppMsgSuccess()
}

function onGoToAuth() {
  useAppRouter().push({ name: AppAuthName })
}
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center bg-bodyColor">
    <n-result
      status="info"
      :title="$t('app.base.notAllowed')"
      :description="$t('app.base.notAllowedDetail', { type: $t(`app.base.${type}`) })"
    >
      <template #footer>
        <div class="flex flex-row flex-nowrap items-center justify-center gap-x-2">
          <n-button type="info" @click="onGoToAuth">
            {{ $t('app.base.back') }}
          </n-button>

          <n-button type="warning" @click="onContactAdmin">
            {{ $t('app.base.contactAdmin') }}
          </n-button>
        </div>
      </template>
    </n-result>
  </div>
</template>
