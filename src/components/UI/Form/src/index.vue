<script lang="ts" setup generic="T">
import type { FormRules } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { WForm } from './types'

import { omit } from 'lodash-es'

import { createAsyncComponent } from '@/utils/factory/asyncComponent'
import WFormItem from '../src/components/FormItem/index.vue'

import { setFormContext } from './hooks/useFormContext'
import { useFormItemId } from './hooks/useFormItemId'
import { useFormMethods } from './hooks/useFormMethods'
import { useFormSchemas } from './hooks/useFormSchemas'
import { calculateRemainingSpans, extendedFormPropKeys, formItemUtils as FIU, generateBaseRules, getScopeOrGlobalProp } from './utils'

defineOptions({
  name: 'WCompUIForm',
})

const props = withDefaults(defineProps<WForm.Props<T> & { class?: string }>(), {
  labelAlign: 'right',
  labelPlacement: 'left',
  model: (): any => {},
  showRequireMark: undefined,
  showFeedback: true,
  showLabel: undefined,
  schemas: () => [],
  cols: 24,
  span: 24,
  xGap: 0,
  yGap: 0,
  baseRules: false,
  visibleMode: 'auto-forward',
})

const emits = defineEmits<WForm.Emits<T>>()

const userStorePreference = useAppStoreUserPreference()

const WFormItemExtendDivider = createAsyncComponent(() => import('./components/Extend/Divider'))
const WFormItemExtendQuery = createAsyncComponent(() => import('./components/Extend/Query'))
const WFormExtendDesc = createAsyncComponent(() => import('./components/Extend/Desc'))
const WFormExtendDialog = createAsyncComponent(() => import('./components/Extend/Dialog'))

const { t } = useAppI18n()

const queryActive = ref(false)

const formRef = useTemplateRef<WForm.Inst.NFormInst>('formRef')

const formPropsCtx = useProps<WForm.Props<T>>(props)

const { setProps, getProps } = formPropsCtx

const getFormProps = computed(() => omit(getProps.value, extendedFormPropKeys))

const formItemIdCtx = useFormItemId<T>()

const dialogFormRef = useTemplateRef<WForm.Inst.DialogInst>('dialogFormRef')
const [DefineForm, ReuseForm] = createReusableTemplate()

const formSchemas = useFormSchemas<T>(getProps, formItemIdCtx)

const formMethods = useFormMethods<T>(formRef)

const getFormRules = computed((): FormRules =>
  getProps.value.baseRules
    ? generateBaseRules<T>(t, formSchemas as Ref<WForm.Schema.Item<T>[]>, getProps)
    : getProps.value.rules!)

const getLabelWidth = computed(() => {
  return getProps.value.labelWidth && typeof getProps.value.labelWidth === 'number' ? `${getProps.value.labelWidth / userStorePreference.getFontSize}rem` : getProps.value.labelWidth
})

// set context
setFormContext<T>({
  formRef,
  formSchemas,
  formEvent: emits,
  formItemIdCtx,
  formPropsCtx,
} as WForm.Context<T>)

// expose
defineExpose({
  ...formMethods,
})

// hook
emits('hook', {
  ...formMethods,
  setProps,
  onOpen: async (beforeHook?: (done: Fn) => void) => {
    await dialogFormRef.value?.onOpen(beforeHook)
  },
  onClose: (close: Fn) => {
    dialogFormRef.value?.onClose(close)
  },
})

function getGridItemStyle(item: WForm.Schema.Item<T>, mode?: 'query' | 'divider'): CSSProperties {
  const span = getScopeOrGlobalProp(item, 'gridProp.span', getProps.value)

  if (mode === 'query') {
    const avaiableSchemaLength = getProps.value.schemas?.filter(i => FIU.getIfOrShowBoolean(i, getProps.value, 'vIf'))
      .filter(i => FIU.getIfOrShowBoolean(i, getProps.value, 'vShow'))
      .filter((i, idx) => formItemIdCtx.getFormItemId(i, idx))
      .length as number

    const totalItem = queryActive.value ? avaiableSchemaLength : avaiableSchemaLength - 1

    const remainSpan = calculateRemainingSpans(totalItem, 24, Array.from<number>({ length: totalItem }).fill(getProps.value.span!))

    if (remainSpan >= 6) {
      return {
        gridColumn: `span ${remainSpan} / span ${remainSpan}`,
        justifySelf: 'end',
      }
    }

    return {
      gridColumn: `span 24 / span 24`,
      justifySelf: 'end',
    }
  }

  if (mode === 'divider') {
    return {
      gridColumn: `span 24 / span 24`,
    }
  }

  return {
    gridColumn: `span ${span} / span ${span}`,
  }
}
</script>

<template>
  <DefineForm>
    <WFormExtendDesc v-if="getProps.descriptionProps" />
    <n-form v-else ref="formRef" v-bind="getFormProps" :rules="getFormRules" :label-width="getLabelWidth">
      <div
        class="relative grid w-full"
        :style="{
          gridTemplateColumns: `repeat(${getProps.cols}, minmax(0, 1fr))`,
          rowGap: `${getProps.yGap}px`,
          columnGap: `${getProps.xGap}px`,
        }"
      >
        <template
          v-for="(item, index) in formSchemas"
          :key="item.type === 'Extend:Query' ? `form-query-${index}` : item.type === 'Extend:Divider' ? `form-divider-${index}` : item.formProp?.path"
        >
          <div
            v-if="item.type === 'Extend:Query' && FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vIf')"
            v-show="FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vShow')"
            :style="Object.assign(getGridItemStyle(item as WForm.Schema.Item<T>, 'query'), item.gridProp?.style)"
            :class="item.gridProp?.class"
          >
            <WTransition appear>
              <n-form-item :show-feedback="false">
                <WFormItemExtendQuery v-bind="item.componentProp" v-model:active="queryActive" />
              </n-form-item>
            </WTransition>
          </div>

          <div
            v-else-if="item.type === 'Extend:Divider' && FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vIf')"
            v-show="item._internalShow && FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vShow')"
            :style="Object.assign(getGridItemStyle(item as WForm.Schema.Item<T>, 'divider'), item.gridProp?.style)"
            :class="item.gridProp?.class"
          >
            <WTransition appear>
              <n-form-item>
                <WFormItemExtendDivider v-bind="item.componentProp" :index="index" />
              </n-form-item>
            </WTransition>
          </div>

          <template v-else>
            <template v-if="getScopeOrGlobalProp(item as WForm.Schema.Item<T>, 'visibleProp.visibleMode', getProps) === 'no-move'">
              <div :style="Object.assign(getGridItemStyle(item as WForm.Schema.Item<T>), item.gridProp?.style)" :class="item.gridProp?.class">
                <WTransition
                  v-if="getScopeOrGlobalProp(item as WForm.Schema.Item<T>, 'transitionProp.transitionName', getProps)"
                  v-bind="item.transitionProp"
                  :transition-name="getScopeOrGlobalProp(item as WForm.Schema.Item<T>, 'transitionProp.transitionName', getProps)"
                  appear
                >
                  <WFormItem
                    v-if="FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vIf')"
                    v-show="item._internalShow && FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vShow')"
                    :item="(item as WForm.Schema.Item<T>)"
                  >
                    <template v-if="item.type === 'Base:Slot' && item.formProp?.path" #[item.formProp?.path]>
                      <slot :name="item.formProp?.path" />
                    </template>
                  </WFormItem>
                </WTransition>

                <WFormItem
                  v-else-if="FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vIf')"
                  v-show="item._internalShow && FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vShow')"
                  :item="(item as WForm.Schema.Item<T>)"
                >
                  <template v-if="item.type === 'Base:Slot' && item.formProp?.path" #[item.formProp?.path]>
                    <slot :name="item.formProp?.path" />
                  </template>
                </WFormItem>
              </div>
            </template>

            <template v-else-if="getScopeOrGlobalProp(item as WForm.Schema.Item<T>, 'visibleProp.visibleMode', getProps) === 'auto-forward'">
              <WTransition
                v-if="getScopeOrGlobalProp(item as WForm.Schema.Item<T>, 'transitionProp.transitionName', getProps)"
                v-bind="item.transitionProp"
                :transition-name="getScopeOrGlobalProp(item as WForm.Schema.Item<T>, 'transitionProp.transitionName', getProps)"
                appear
              >
                <div
                  v-if="FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vIf')"
                  v-show="item._internalShow && FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vShow')"
                  :style="Object.assign(getGridItemStyle(item as WForm.Schema.Item<T>), item.gridProp?.style)"
                  :class="item.gridProp?.class"
                >
                  <WFormItem :item="(item as WForm.Schema.Item<T>)">
                    <template v-if="item.type === 'Base:Slot' && item.formProp?.path" #[item.formProp?.path]>
                      <slot :name="item.formProp?.path" />
                    </template>
                  </WFormItem>
                </div>
              </WTransition>

              <div
                v-else-if="FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vIf')"
                v-show="item._internalShow && FIU.getIfOrShowBoolean(item as WForm.Schema.Item<T>, getProps, 'vShow')"
                :style="Object.assign(getGridItemStyle(item as WForm.Schema.Item<T>), item.gridProp?.style)"
                :class="item.gridProp?.class"
              >
                <WFormItem :item="(item as WForm.Schema.Item<T>)">
                  <template v-if="item.type === 'Base:Slot' && item.formProp?.path" #[item.formProp?.path]>
                    <slot :name="item.formProp?.path" />
                  </template>
                </WFormItem>
              </div>
            </template>
          </template>
        </template>
      </div>
    </n-form>
  </DefineForm>

  <WFormExtendDialog v-if="getProps.dialogPreset" ref="dialogFormRef">
    <ReuseForm />
  </WFormExtendDialog>
  <ReuseForm v-else />
</template>
