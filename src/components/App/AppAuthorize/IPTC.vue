<script lang="ts" setup>
import type { FormItemRule } from 'naive-ui'
import type { IAppAuthorizeIPTCProps } from '.'

defineOptions({
  name: 'AppAuthorizeInputPermissionToConfirm',
  inheritAttrs: false,
})

const props = defineProps<IAppAuthorizeIPTCProps>()

const emits = defineEmits<{ success: [] }>()

const inputValue = ref<string>()
const rightPermission = ref(false)
const inputValid = ref(true)

const { t } = useAppI18n()
const userStorePermission = useAppStoreUserPermission()

function onSuccess() {
  emits('success')
  inputValid.value = true
  rightPermission.value = true
}

watch(
  () => props.value,
  (v) => {
    if (v && userStorePermission.hasPermission(v))
      onSuccess()
  },
  {
    immediate: true,
  },
)

const rule: FormItemRule = {
  trigger: ['blur', 'change'],

  validator() {
    if (!inputValue.value) {
      inputValid.value = true
      return true
    }

    if (inputValue.value !== props.value) {
      inputValid.value = false
      return new Error(t('app.authorize.iptc.error'))
    }

    onSuccess()

    return true
  },
}

function onKeyup() {
  if (inputValue.value !== props.value) {
    inputValid.value = false
    useAppMsgError(t('app.authorize.iptc.error'))
  }
  else {
    onSuccess()
  }
}
</script>

<template>
  <WTransition appear transition-name="fade-down">
    <div
      v-if="!rightPermission"
      class="relative flex items-center justify-center"
      :style="{ height: presetHeight, width: presetWidth }"
    >
      <div
        class="h-full w-full bg-gray-500/50 blur-sm brightness-80 contrast-50"
      />

      <n-form-item
        class="abs-center"
        style="width: 80%"
        :label="t('app.authorize.iptc.label')"
        :rule="rule"
      >
        <n-input
          v-model:value="inputValue"
          clearable
          type="password"
          :status="inputValid ? 'success' : 'warning'"
          @keyup.enter="onKeyup"
          @clear="inputValid = true"
        />
      </n-form-item>
    </div>

    <slot v-else />
  </WTransition>
</template>
