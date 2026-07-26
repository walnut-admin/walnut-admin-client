<script lang="ts" setup>
import type { RawEditorOptions } from 'tinymce'

import type { ICompVendorTinymceProps } from '.'
import TinymceEditor from '@tinymce/tinymce-vue'
import { genString } from 'easy-fns-ts'
import { menubar, plugins, toolbar } from './resource'

defineOptions({
  name: 'WCompVendorTinymce',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ICompVendorTinymceProps>(), {
  disabled: false,
  width: '100%',
})

const value = defineModel<string>('value')

interface TinymceVueInstance {
  rerender: (p: RawEditorOptions) => Promise<void>
}

const editorId = ref(`tinymce-${genString(8)}`)
// third party libs should use shallowRef !!!
const editorRef = shallowRef<TinymceVueInstance>()

const loading = ref(false)

const appStoreLocale = useAppStoreLocale()

const getSkinName = computed(() =>
  isDark.value ? 'tinymce-5-dark' : 'tinymce-5',
)

const getLangName = computed(() => appStoreLocale.locale!)

const tinymceOptions = computed((): RawEditorOptions => {
  return {
    license_key: 'gpl',
    promotion: false,
    selector: `#${editorId.value}`,

    // remove right bottom logo
    branding: false,

    height: props.height,
    width: props.width,

    // theme
    skin: getSkinName.value,
    content_css: getSkinName.value,

    // locale
    directionality: 'ltr',
    language: getLangName.value === 'en_US' ? undefined : getLangName.value,
    language_load: true,

    // settings
    plugins,
    menubar,
    toolbar,

    init_instance_callback() {
      loading.value = false
    },
  }
})

watch(
  () => [getSkinName, getLangName],
  async () => {
    loading.value = true

    await editorRef.value?.rerender(tinymceOptions.value)
  },
  {
    deep: true,
    immediate: true,
  },
)

const { httpUrl } = useAppEnvProxy()
</script>

<template>
  <n-spin :show="loading" class="w-full">
    <TinymceEditor
      :id="editorId"
      ref="editorRef"
      v-model="value"
      :tinymce-script-src="`${httpUrl}/static/js/tinymce/tinymce.min.js`"
      api-key="no-api-key"
      license-key="gpl"
      :init="tinymceOptions"
      model-events="change input keydown blur focus paste"
      :disabled="disabled"
    />
  </n-spin>
</template>
