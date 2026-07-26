<script lang="ts" setup generic="T">
import type { WForm } from '../../types'
import { clone, isBoolean, isFunction, omit } from 'lodash-es'
import { useFormContext } from '../../hooks/useFormContext'
import { formItemUtils } from '../../utils'

defineOptions({
  name: 'WCompUIFormItem',
})

const { item } = defineProps<{ item: WForm.Schema.Item<T> }>()

const { formPropsCtx } = useFormContext<T>()
const { getProps } = formPropsCtx

const getFormItemDictLabel = computed(() => getDictNameFromMap((item as WForm.Schema.SchemaItem.DictSchema<T>).componentProp!.dictType) as string ?? '')

const getFormItemProps = computed(() => {
  if (isBoolean(item?.formProp?.rule) && isBoolean(item?.formProp?.label)) {
    return omit(clone(item?.formProp), 'rule', 'label')
  }

  if (isBoolean(item?.formProp?.rule)) {
    return omit(clone(item?.formProp), 'rule')
  }

  if (isBoolean(item?.formProp?.label)) {
    return omit(clone(item?.formProp), 'label')
  }

  return item.formProp
})

function FormItemRender() {
  const _item = item as WForm.Schema.SchemaItem.RenderSchema<T>

  return isFunction(_item.componentProp?.render)
    && _item!.componentProp?.render!({
      formData: getProps.value.model!,
      formProps: getFormItemProps.value,
    })
}

const getBuiltInComp = formItemUtils.getTargetComponent(item)
</script>

<template>
  <n-form-item
    :class="getProps.formItemClass"
    v-bind="getFormItemProps"
  >
    <template #label>
      <div class="flex flex-row flex-nowrap items-center justify-end gap-x-1">
        <template v-if="item.type === 'Business:Dict' && item.formProp?.label === true">
          {{ $t(getFormItemDictLabel) }}
        </template>
        <template v-else>
          {{ formItemUtils.getTranslatedString($t, item, getProps) }}
        </template>

        <WMessage v-if="item.formProp?.labelHelpMessage" :msg="formItemUtils.getTranslatedString($t, item, getProps, 'helpMsg')" />
      </div>
    </template>

    <template #default>
      <FormItemRender v-if="item.type === 'Base:Render'" />
      <slot v-else-if="item.type === 'Base:Slot'" :name="item.formProp?.path" />
      <!-- @vue-expect-error -->
      <component
        :is="getBuiltInComp"
        v-if="getBuiltInComp"
        v-model:value="getProps.model![item.formProp?.path!]"
        v-bind="item.componentProp"
        :class="getProps.formItemComponentClass"
      />
    </template>
  </n-form-item>
</template>
