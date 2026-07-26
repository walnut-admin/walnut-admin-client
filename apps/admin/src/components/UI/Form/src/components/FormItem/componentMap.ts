import type { Recordable } from 'easy-fns-ts'
import { NDynamicInput, NInputOtp, NSlider } from 'naive-ui'
import { createAsyncComponent } from '@/utils/factory/asyncComponent'

const BUILT_IN_FORM_ITEM_TYPE_UI = [
  'Button',
  'ButtonConfirm',
  'ButtonGroup',
  'ButtonRetry',
  'Checkbox',
  'ColorPicker',
  'DatePicker',
  'DynamicTags',
  'Input',
  'InputNumber',
  'Radio',
  'Select',
  'Switch',
  'TimePicker',
  'Tree',
  'TreeSelect',
] as const

const BUILT_IN_FORM_ITEM_TYPE_EXTRA = [
  'EmailInput',
  'IconPicker',
  'LocaleSelect',
  'Password',
  'PhoneNumberInput',
  'VerifyCode',
  'TransitionSelect',
] as const

const BUILT_IN_FORM_ITEM_TYPE_BUSINESS = [
  'AreaCascader',
  'Dict',
] as const

const BUILT_IN_FORM_ITEM_TYPE_EXTEND = [
  'Query',
  'Divider',
] as const

/**
 * @description Generate all usable components through `BUILT_IN_FORM_ITEM_TYPE_UI`.
 * Problems:
 *  1. Need to have same structure as examples if want to add new component
 *  2. Need to add corresponding `TYPE` to `BUILT_IN_FORM_ITEM_TYPE_UI`
 */
function getUIComponents(type: typeof BUILT_IN_FORM_ITEM_TYPE_UI) {
  const ret: Recordable = {}

  type.forEach((key) => {
    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    // Below for prod, no alias and must point to file with extension
    ret[key] = createAsyncComponent(() => import(`../../../../${key}/index.ts`))
  })

  return ret
}
function getExtraComponents(type: typeof BUILT_IN_FORM_ITEM_TYPE_EXTRA) {
  const ret: Recordable = {}

  type.forEach((key) => {
    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    // Below for prod, no alias and must point to file with extension
    ret[key] = createAsyncComponent(() => import(`../../../../../Extra/${key}/index.ts`))
  })

  return ret
}
function getBusinessComponents(type: typeof BUILT_IN_FORM_ITEM_TYPE_BUSINESS) {
  const ret: Recordable = {}

  type.forEach((key) => {
    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    // Below for prod, no alias and must point to file with extension
    ret[key] = createAsyncComponent(() => import(`../../../../../Business/${key}/index.ts`))
  })

  return ret
}
function getExtendComponents(type: typeof BUILT_IN_FORM_ITEM_TYPE_EXTEND) {
  const ret: Recordable = {}

  type.forEach((key) => {
    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    // Below for prod, no alias and must point to file with extension
    ret[key] = createAsyncComponent(() => import(`../Extend/${key}/index.ts`))
  })

  return ret
}

// Form component map
const componentMap = new Map()

// ui
const UIComponents = getUIComponents(BUILT_IN_FORM_ITEM_TYPE_UI)
BUILT_IN_FORM_ITEM_TYPE_UI.forEach((key) => {
  componentMap.set(key, UIComponents[key])
})

// extra
const ExtraComponents = getExtraComponents(BUILT_IN_FORM_ITEM_TYPE_EXTRA)
BUILT_IN_FORM_ITEM_TYPE_EXTRA.forEach((key) => {
  componentMap.set(key, ExtraComponents[key])
})

// extra
const BusinessComponents = getBusinessComponents(BUILT_IN_FORM_ITEM_TYPE_BUSINESS)
BUILT_IN_FORM_ITEM_TYPE_BUSINESS.forEach((key) => {
  componentMap.set(key, BusinessComponents[key])
})

// extend
const ExtendComponents = getExtendComponents(BUILT_IN_FORM_ITEM_TYPE_EXTEND)
BUILT_IN_FORM_ITEM_TYPE_EXTEND.forEach((key) => {
  componentMap.set(key, ExtendComponents[key])
})

// raw
componentMap.set('Slider', NSlider)
componentMap.set('DynamicInput', NDynamicInput)
componentMap.set('InputOtp', NInputOtp)

componentMap.set(
  'RoleSelect',
  createAsyncComponent(
    () => import('../../../../../Advanced/RoleSelect/index'),
  ),
)
componentMap.set(
  'Tinymce',
  createAsyncComponent(
    () => import('../../../../../Vendor/Tinymce/index'),
  ),
)
componentMap.set(
  'JSONEditor',
  createAsyncComponent(
    () => import('../../../../../Vendor/JSONEditor/index'),
  ),
)

export { componentMap }
