<script lang="ts" setup generic="T">
import type { ICompUIDescriptionsItem } from '@/components/UI/Descriptions'
import { get } from 'lodash-es'
import { useFormContext } from '../../../hooks/useFormContext'
import { formItemUtils } from '../../../utils'

defineOptions({
  name: 'WFormExtendDesc',
})

const { t } = useAppI18n()

const { formSchemas, formPropsCtx } = useFormContext<T>()

const { getProps: formProps } = formPropsCtx

const getDescItems = computed(() => {
  return formSchemas.value
    .filter(i => i.formProp?.path)
    .map(i => ({
      key: i.formProp?.path,
      show: i.descriptionProp?.show,
      value: get(formProps.value.model!, i.formProp?.path as string),
      formatter: i.descriptionProp?.formatter,
      copy: i.descriptionProp?.copy,

      type: i.descriptionProp?.type,
      typeProps: i.descriptionProp?.typeProps,
      label: formItemUtils.getTranslatedString(t, i, formProps.value),
      span: i.descriptionProp?.span ?? formProps.value.descriptionProps?.column,
    } as ICompUIDescriptionsItem))
})
</script>

<template>
  <WDescriptions
    v-bind="formProps.descriptionProps"
    :label-placement="formProps.labelPlacement"
    :label-align="formProps.labelAlign"
    :label-style="{ width: `${formProps.labelWidth}px` }"
    :items="getDescItems"
  />
</template>
