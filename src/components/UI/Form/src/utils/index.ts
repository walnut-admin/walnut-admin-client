import type { Recordable } from 'easy-fns-ts'
import type { FormItemRule, FormRules } from 'naive-ui'
import type { WForm } from '../types'
import { get } from 'lodash-es'
import { getBoolean } from '@/utils/shared'
import { wbtoa } from '@/utils/window/base64'
import { componentMap } from '../components/FormItem/componentMap'

const appStoreLocale = useAppStoreLocale()

type SchemaItem<T> = WForm.Schema.Item<T>
type FormProps<T> = WForm.Props<T>

function buildLocaleKey(type: WForm.LocaleType, base: string) {
  switch (type) {
    case 'origin': return base
    case 'helpMsg': return `${base}.helpMsg`
    case 'placeholder': return `${base}.PH`
    case 'rule': return `${base}.rule`
  }
}

function getRawValue<T>(item: SchemaItem<T>, type: WForm.LocaleType) {
  const { formProp, componentProp } = item
  switch (type) {
    case 'origin': return formProp?.label
    case 'helpMsg': return formProp?.labelHelpMessage
    case 'placeholder': return componentProp?.placeholder
    case 'rule': return undefined
  }
}

/**
 * @description get scope or global prop
 */
export function getScopeOrGlobalProp<T>(item: SchemaItem<T>, itemField: 'transitionProp.transitionName', props: FormProps<T>): ValueOfAppConstTransitionName
export function getScopeOrGlobalProp<T>(item: SchemaItem<T>, itemField: 'visibleProp.visibleMode', props: FormProps<T>): WForm.FormVisibleMode
export function getScopeOrGlobalProp<T>(item: SchemaItem<T>, itemField: 'gridProp.span', props: FormProps<T>): number
export function getScopeOrGlobalProp<T>(item: SchemaItem<T>, itemField: WForm.FormScopeGlobalFields, props: FormProps<T>) {
  return get(item, itemField) ?? props[itemField.split('.')[1] as keyof FormProps<T>]
}

export const formItemUtils = {
  /**
   * @description get dynamic component from componentMap
   */
  getTargetComponent<T>(item: SchemaItem<T>) {
    return componentMap.get(item?.type.split(':')[1])
  },

  /**
   * @description get v-if/v-show boolean
   */
  getIfOrShowBoolean<T>(item: SchemaItem<T>, props: FormProps<T>, field: WForm.MaybeBooleanField, defaultValue = true) {
    const maybeBool = item?.visibleProp?.[field]

    if (typeof maybeBool === 'function')
      return maybeBool({ formData: props.model! })

    return getBoolean(toRaw(maybeBool), defaultValue)
  },

  /**
   * @description generate form item based on item & index
   */
  generateFormItemId<T>(item: SchemaItem<T>, index: number) {
    return wbtoa(`${item?.type}-${index}-${item?.formProp?.path}`)
  },

  /**
   * @description get translated string based on item & index
   */
  getTranslatedString<T>(
    t: Fn,
    item: SchemaItem<T>,
    props: FormProps<T>,
    type: WForm.LocaleType = 'origin',
  ) {
    const itemFormProp = item.formProp ?? {}
    const key = props.localeUniqueKey

    const label = itemFormProp.label
    const path = itemFormProp.path
    const locale = itemFormProp.locale
    const labelHelpMessage = itemFormProp.labelHelpMessage
    const localeWithTable = itemFormProp.localeWithTable

    // dict name as label, so no need to translate
    if (label === true)
      return
    // description do not show, so no need to translate
    if (!getBoolean(item?.descriptionProp?.show))
      return

    // base key priority first
    if (path && appStoreLocale.isBaseI18nKey(path)) {
      return t(`app.base.${path}`)
    }
    if (typeof label === 'string' && appStoreLocale.isBaseI18nKey(label)) {
      return t(`app.base.${label}`)
    }

    // helpMsg special case
    if (path && type === 'helpMsg' && labelHelpMessage) {
      if (!getBoolean(locale))
        return labelHelpMessage
    }

    // step1: judge whether need locale（parent + child）
    const needLocale = key && getBoolean(locale)

    // step2: no locale or no key/path → fallback original value
    if (!needLocale || !path) {
      return getRawValue(item, type)
    }

    // step3: judge whether need table prefix（parent + child）
    const isLocaleWithTable
      = getBoolean(localeWithTable) && getBoolean(props.localeWithTable)

    const prefix = isLocaleWithTable ? 'table' : 'form'
    const fullKey = buildLocaleKey(type, `${key}.${path}`)

    return t(`${prefix}.${fullKey}`)
  },
}

/**
 * @description form item type that need to show `input` something
 */
export const inputFormItemTypeList = [
  'Base:Input',
  'Base:InputNumber',
  'Extra:Password',
  'Extra:VerifyCode',
  'Extra:EmailInput',
]

/**
 * generate different default rule message through based on `inputFormItemTypeList`
 */
export function generateRuleMessage<T>(t: Fn, i: SchemaItem<T>, p: ComputedRef<FormProps<T>>) {
  return t('comp.form.rule', {
    type: inputFormItemTypeList.includes(i.type)
      ? t('comp.base.input')
      : t('comp.base.choose'),
    label: formItemUtils.getTranslatedString(t, i, p.value),
  })
}

/**
 * @description generate base rules based on schemas
 */
export function generateBaseRules<T>(t: ReturnType<typeof AppI18n>['global']['t'], schemas: Ref<SchemaItem<T>[]>, props: ComputedRef<FormProps<T>>): FormRules {
  const getBaseRuleObj = (
    i: SchemaItem<T>,
    extra?: FormItemRule[],
  ): FormItemRule[] => {
    const base: FormItemRule[] = [
      {
        key: i?.formProp?.path as string,
        type: i.formProp?.ruleType || 'any',
        trigger: ['change', 'input'],
        required: true,
        message: generateRuleMessage<T>(t, i, props),
      },
    ]

    return extra ? base.concat(extra) : base
  }

  return Object.fromEntries(
    schemas.value
      .map((i) => {
        if (i.formProp?.path && i.formProp?.rule !== false) {
          return [
            i.formProp.path,
            i.formProp.rule
              ? getBaseRuleObj(
                  i,
                  (Array.isArray(i.formProp.rule)
                    ? i.formProp.rule
                    : [i.formProp.rule]) as FormItemRule[],
                )
              : getBaseRuleObj(i),
          ]
        }
        return []
      })
      .filter(i => i.length !== 0),
  )
}

export function extractDefaultFormDataFromSchemas<T>(schemas: SchemaItem<T>[]) {
  if (!schemas || !schemas.length)
    return {} as T

  return Object.fromEntries(
    unref(schemas)
      .filter(i => i.formProp?.path)
      .map<[string, WForm.DefaultValue]>(i => [
        i.formProp!.path as string,
        i?.componentProp?.defaultValue ?? null,
      ]),
  ) as T
}

export const extendedFormPropKeys: (keyof FormProps<Recordable>)[] = [
  'schemas',
  'cols',
  'span',
  'xGap',
  'yGap',
  'baseRules',
  'visibleMode',
  'transitionName',
  'formItemClass',
  'formItemComponentClass',
  'dialogPreset',
  'dialogProps',
  'localeUniqueKey',
  'localeWithTable',
  'descriptionProps',
]

// Generated by Doubao
export function calculateRemainingSpans(
  totalItems: number,
  itemsPerRow: number,
  spans: number[],
): number {
  if (totalItems <= 0 || itemsPerRow <= 0) {
    return 0
  }

  // 确保 spans 数组长度与项目数一致
  const normalizedSpans = spans.slice(0, totalItems).concat(
    Array.from<number>({ length: totalItems - spans.length }).fill(1),
  )

  // 计算总 span 数
  const totalSpans = normalizedSpans.reduce((sum, span) => sum + span, 0)

  // 计算总行数（向上取整）
  const totalRows = Math.ceil(totalSpans / itemsPerRow)

  // 如果只有一行，直接计算剩余 span
  if (totalRows === 1) {
    return itemsPerRow - totalSpans
  }

  // 计算前面所有行占用的 span 总和
  let usedSpansInPreviousRows = 0
  let currentRowSpans = 0
  let currentRow = 1

  for (const span of normalizedSpans) {
    // 如果加入当前项目的 span 会超过每行的限制，则换行
    if (currentRowSpans + span > itemsPerRow) {
      currentRow++
      currentRowSpans = span
    }
    else {
      currentRowSpans += span
    }

    // 只累加前面行的 span
    if (currentRow < totalRows) {
      usedSpansInPreviousRows += span
    }
    else {
      // 已经到最后一行，停止遍历
      break
    }
  }

  // 计算最后一行已使用的 span
  const usedSpansInLastRow = totalSpans - usedSpansInPreviousRows

  // 计算剩余 span
  return Math.max(0, itemsPerRow - usedSpansInLastRow)
}
