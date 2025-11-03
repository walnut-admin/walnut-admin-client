<script lang="ts" setup  generic="T">
import type { Recordable } from 'easy-fns-ts'
import { omit } from 'lodash-es'
import { useFormContext } from '../../../hooks/useFormContext'

defineOptions({
  name: 'WFormExtendDialog',
})

const { formPropsCtx, formRef } = useFormContext<T>()

const { getProps: formProps } = formPropsCtx

const { t } = useAppI18n()

const show = ref(false)
const loading = ref(false)

const getCloseConfirm = computed(() => formProps.value.dialogProps?.closeConfirm)

const loadFinish = () => (loading.value = false)

async function onOpen(beforeHook?: Fn) {
  loading.value = true

  if (beforeHook)
    await beforeHook(loadFinish)
  else
    loadFinish()

  show.value = true
}

function onClose() {
  show.value = false
  return false
}

async function onBeforeClose() {
  if (getCloseConfirm.value) {
    const { confirmed } = await useAppConfirm(t('comp.form.closeConfirm'))
    return confirmed
  }
  else {
    onClose()
    return true
  }
}

async function onYes() {
  try {
    await formRef.value!.validate()

    loading.value = true

    // if error, we want loading stop, but drawer do not disappear
    // so `loading.value = false` is always excuting
    // only when have result, close drawer and show message
    const apiHandler = async (apiFn: Fn, params: Recordable) => {
      try {
        const result = await apiFn(params)

        if (result) {
          onClose()
          useAppMsgSuccess()
        }
        else {
          return Promise.reject(new Error('Request Error'))
        }
      }
      // NOTICE do not catch here, we want block and do not excute code below
      // catch (err) {
      //   console.log('useFormDialog', err)
      // }
      finally {
        loadFinish()
      }
    }

    formProps.value.dialogProps?.onYes!(apiHandler, () => {
      loadFinish()
      onClose()
    })
  }
  catch (err) {
    console.log(err)
  }
}

function onNo() {
  if (!formProps.value.descriptionProps)
    formRef.value!.restoreValidation()

  if (formProps.value.dialogProps?.onNo) {
    formProps.value.dialogProps?.onNo(onClose)
  }
}

function onGetTitle(title: string) {
  const uniqueKey = formProps.value.localeUniqueKey

  const actionType = unref(formProps.value?.dialogProps?.actionType)

  if (!actionType)
    return title

  return title
    ? `${t(`app.base.${actionType}`)}${t(title)}`
    : uniqueKey
      ? `${t(`app.base.${actionType}`)}${t(`table.${uniqueKey}.advancedTitle`)}`
      : title
}

const getTitle = computed(() => onGetTitle(formProps.value.dialogProps?.title as string))

const getBindProps = computed(() => omit(formProps.value.dialogProps, ['onYes', 'onNo', 'show', 'title', 'loading', 'displayDirective']))

onDeactivated(() => {
  onClose()
})

defineExpose({ onOpen, onClose })
</script>

<template>
  <!-- @vue-skip -->
  <div>
    <WModal
      v-if="formProps.dialogPreset === 'modal'"
      v-bind="getBindProps"
      v-model:show="show"
      :before-close="onBeforeClose"
      :loading="loading"
      :title="getTitle"
      :display-directive="formProps.dialogProps?.displayDirective ?? 'show'"
      @yes="onYes"
      @no="onNo"
    >
      <slot />
    </WModal>

    <WDrawer
      v-else-if="formProps.dialogPreset === 'drawer'"
      v-bind="getBindProps"
      v-model:show="show"
      :before-close="onBeforeClose"
      :loading="loading"
      :title="getTitle"
      :display-directive="formProps.dialogProps?.displayDirective ?? 'show'"
      @yes="onYes"
      @no="onNo"
    >
      <slot />

      <template v-if="formProps.dialogProps?.footerButtons" #footer>
        <WButtonGroup :groups="formProps.dialogProps?.footerButtons" />
      </template>
    </WDrawer>
  </div>
</template>
