import type { BaseDataType, Recordable, StringOrNumber } from 'easy-fns-ts'
// raw
import type {
  DynamicInputProps,
  FormInst,
  FormItemProps,
  FormItemRule,
  FormRules,
  SliderProps,
} from 'naive-ui'
import type { LabelAlign, LabelPlacement, Size } from 'naive-ui/es/form/src/interface'

import type { CSSProperties } from 'vue'
// ui types
import type { ICompUIButtonProps } from '../../Button'
import type { ICompUIButtonConfirmProps } from '../../ButtonConfirm'
import type { ICompUIButtonGroupProps } from '../../ButtonGroup'
import type { ICompUIButtonRetryProps } from '../../ButtonRetry'
import type { ICompUICheckboxProps } from '../../Checkbox'
import type { ICompUIColorPickerProps } from '../../ColorPicker'
import type { ICompUIDatePickerProps } from '../../DatePicker'

import type { ICompUIDescriptionProps, ICompUIDescriptionsItem } from '../../Descriptions'
import type { ICompUIDrawerProps } from '../../Drawer'

import type { ICompUIDynamicTagsProps } from '../../DynamicTags'
import type { ICompUIInputProps } from '../../Input'
import type { ICompUIInputNumberProps } from '../../InputNumber'
import type { ICompUIModalProps } from '../../Modal'
import type { ICompUIRadioProps } from '../../Radio'
import type { ICompUISelectProps } from '../../Select'
import type { ICompUISwitchProps } from '../../Switch'
import type { ICompUITimePickerProps } from '../../TimePicker'
import type { ICompUITreeProps } from '../../Tree'
import type { ICompUITreeSelectProps } from '../../TreeSelect'
// extend
import type { ICompUIFormItemExtendDividerProps } from './components/Extend/Divider'
import type { ICompUIFormItemExtendQueryProps } from './components/Extend/Query'
import type { ICompUIFormHooksItemId } from './hooks/useFormItemId'
import type { ICompUIFormHooksMethods } from './hooks/useFormMethods'
// business
import type { ICompBusinessAreaCascaderProps } from '@/components/Business/AreaCascader'
import type { ICompBusinessDictProps } from '@/components/Business/Dict'

// extra
import type { ICompExtraEmailInputProps } from '@/components/Extra/EmailInput'
import type { ICompExtraIconPickerProps } from '@/components/Extra/IconPicker'
import type { ICompExtraLocaleSelectProps } from '@/components/Extra/LocaleSelect'
import type { ICompExtraPasswordProps } from '@/components/Extra/Password'
import type { ICompExtraPhoneNumberInputProps } from '@/components/Extra/PhoneNumberInput'
import type { ICompExtraTransitionProps } from '@/components/Extra/Transition'
import type { ICompExtraVerifyCodeProps } from '@/components/Extra/VerifyCode'
import type { ICompVendorTinymceProps } from '@/components/Vendor/Tinymce'
import type { IHooksUseProps } from '@/hooks/core/useProps'

export declare type RuleType = 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email' | 'pattern' | 'any'

export declare namespace WForm {
  type FormDialogPreset = 'modal' | 'drawer'

  type LocaleType = 'origin' | 'helpMsg' | 'rule' | 'placeholder'

  type MaybeBooleanField = 'vIf' | 'vShow'

  type DictComponentType = 'select' | 'checkbox' | 'radio'

  type FormVisibleMode = 'no-move' | 'auto-forward'

  type FormScopeGlobalFields = 'transitionProp.transitionName' | 'visibleProp.visibleMode' | 'gridProp.span'

  type DefaultValue = BaseDataType | BaseDataType[] | undefined | null

  type onFinishFormLoadingCallback = Fn<Params.Dialog.FinishLoading, void | Promise<void>>

  /**
   * @description callback function
   */
  type FormFnCallback<T = any, R = void> = ({ formData, formProps }: { formData: T, formProps?: Schema.SchemaItemFormProps<T> }) => R

  /**
   * @description set table props
   */
  type SetFormProps<T> = IHooksUseProps<Props<T>>['setProps']

  /**
   * @description Inst
   */
  namespace Inst {
    type NFormInst = FormInst

    interface DialogInst {
      onOpen: (beforeHook?: (done: Fn) => void) => Promise<void> | void
      onClose: Fn
    }

    interface ExtendInst<T> {
      setProps: SetFormProps<T>

    }

    interface WFormInst<T> extends Omit<NFormInst, 'validate'>, DialogInst, ExtendInst<T> {
      // rewrite
      validate: (fields?: (keyof T)[]) => Promise<boolean>

      onYes?: (
        apiHandler: (apiFn: Fn, params: Recordable) => Promise<void>,
        done: () => void
      ) => void | Promise<void>
      onNo?: (close: Fn) => void | Promise<void>
    }
  }

  /**
   * @description Hooks
   */
  namespace Hooks {
    namespace UseForm {
      type Props<T> = WForm.Props<T> | ComputedRef<WForm.Props<T>> | IDeepMaybeRef<WForm.Props<T>>

      type Methods<T> = ICompUIFormHooksMethods<T> & Pick<Inst.WFormInst<T>, 'onOpen' | 'onClose'>

      type ReturnType<T> = [
        (instance: Inst.WFormInst<T>) => void,
        Methods<T>,
      ]
    }
  }

  interface Props<T> {
    // original
    inline?: boolean
    labelWidth?: StringOrNumber
    labelAlign?: LabelAlign
    labelPlacement?: LabelPlacement
    model?: T
    rules?: FormRules
    disabled?: boolean
    size?: Size
    showRequireMark?: boolean
    requireMarkPlacement?: 'left' | 'right' | 'right-hanging'
    showFeedback?: boolean
    showLabel?: boolean

    // custom
    schemas?: WForm.Schema.Item<T>[]
    cols?: number
    span?: number
    xGap?: number
    yGap?: number
    baseRules?: boolean

    /**
     * @description global v-if/v-show form item visible position mode
     */
    visibleMode?: FormVisibleMode

    /**
     * @description global transition name
     */
    transitionName?: ValueOfAppConstTransitionName

    /**
     * @description form item class, including the label and content
     */
    formItemClass?: string

    /**
     * @description class only for form item component
     */
    formItemComponentClass?: string

    /**
     * @description model/drawer form preset
     */
    dialogPreset?: FormDialogPreset

    /**
     * @description model/drawer props
     */
    dialogProps?: (ICompUIModalProps | ICompUIDrawerProps)
      & ICompUIModalProps & Partial<Pick<Inst.WFormInst<T>, 'onYes' | 'onNo'>> & {

        /**
         * @description  used to show different dialog title
         */
        actionType?: IActionType
        defaultButton?: boolean
        resizable?: boolean
        defaultWidth?: string
        defaultHeight?: string
        width?: string
        height?: string

        /**
         * @description confirm before dialog closed
         */
        closeConfirm?: boolean
      }

    /**
     * @description locale middle unique key implement with back end messages
     * @example `form.${uniqueKey}.${path}` used for label locale
     * @example `form.${uniqueKey}.${path}.helpMsg` built in for label help message
     * So in this rule, all we need to do is provide a `localeUniqueKey` and config the messages in `Locale Manage`
     * No need to privide a label property in `schema item formProp`, the built in logic will handle the label properly.
     */
    localeUniqueKey?: string

    /**
     * @description Used for form related to a localed table
     */
    localeWithTable?: boolean

    /**
     * @description description props
     */
    descriptionProps?: Omit<ICompUIDescriptionProps, 'items'>
  }

  /**
   * @description Form context
   */
  interface Context<T> {
    formRef: Ref<Inst.NFormInst | null>
    formSchemas: Ref<Schema.Item<T>[]>
    formEvent: ShortEmits<Emits<T>>
    formItemIdCtx: ICompUIFormHooksItemId<T>
    formPropsCtx: IHooksUseProps<Props<T>>
  }

  /**
   * @description Form Emits
   */
  interface Emits<T> {
    hook: [inst: Omit<Inst.WFormInst<T>, 'onYes' | 'onNo'> & Inst.DialogInst]
    query: [params: Params.Dialog.FinishLoading]
    reset: [params: Params.Dialog.FinishLoading]
  }

  /**
   * @description Form Params
   */
  namespace Params {
    interface Callback<T = any> {
      formData: T
      formProps?: Schema.SchemaItemFormProps<T>
    }

    namespace Dialog {
      interface FinishLoading { done: Fn }
    }
  }

  /**
   * @description Form Schema
   */
  namespace Schema {
    interface DomProps {
      style?: CSSProperties
      class?: string
    }

    interface ComponentPropPool<D> {
      // base
      'Base:Render': {
        render: FormFnCallback<D, VNode | VNode[] | string>
      }
      'Base:Slot': Record<string, never>

      // @/components/UI
      'Base:Button': ICompUIButtonProps
      'Base:ButtonConfirm': ICompUIButtonConfirmProps
      'Base:ButtonGroup': ICompUIButtonGroupProps
      'Base:ButtonRetry': ICompUIButtonRetryProps
      'Base:Checkbox': ICompUICheckboxProps
      'Base:ColorPicker': ICompUIColorPickerProps
      'Base:DatePicker': ICompUIDatePickerProps
      'Base:DynamicTags': ICompUIDynamicTagsProps
      'Base:Input': ICompUIInputProps
      'Base:InputNumber': ICompUIInputNumberProps
      'Base:Radio': ICompUIRadioProps
      'Base:Select': ICompUISelectProps
      'Base:Switch': ICompUISwitchProps
      'Base:TimePicker': ICompUITimePickerProps
      'Base:Tree': ICompUITreeProps<D>
      'Base:TreeSelect': ICompUITreeSelectProps

      // @/components/Extra
      'Extra:EmailInput': ICompExtraEmailInputProps
      'Extra:IconPicker': ICompExtraIconPickerProps
      'Extra:LocaleSelect': ICompExtraLocaleSelectProps
      'Extra:Password': ICompExtraPasswordProps
      'Extra:PhoneNumberInput': ICompExtraPhoneNumberInputProps
      'Extra:VerifyCode': ICompExtraVerifyCodeProps
      'Extra:TransitionSelect': ICompExtraTransitionProps

      // raw
      'Raw:DynamicInput': DynamicInputProps
      'Raw:Slider': SliderProps

      // business
      'Business:AreaCascader': ICompBusinessAreaCascaderProps
      'Business:Dict': ICompBusinessDictProps

      // extend
      'Extend:Query': ICompUIFormItemExtendQueryProps
      'Extend:Divider': ICompUIFormItemExtendDividerProps

      'Extend:RoleSelect': {
        multiple?: boolean
        valueSeparator?: string
        valueType?: 'string' | 'number'
      }

      'Vendor:Tinymce': ICompVendorTinymceProps
    }

    type SchemaItemFormProps<T> = Omit<FormItemProps, 'rule' | 'label' | 'path'> & {
      /**
       * @override
       * @description add boolean type to rule
       * Set `rule` false when set `baseRules` true but this form item uses no rule
       */
      rule?: FormItemRule | FormItemRule[] | undefined | boolean

      /**
       * @override
       * @description add boolean type to label
       * Used for dict form item label, set true to use dict type name as form label
       */
      label?: string | boolean

      /**
       * @override
       * @description path typescript support
       */
      path?: DeepKeyOf<T>

      /**
       * @description when using `base-rules`, you can provide a `ruleType` to specific the value type, default would ba a `any`
       * Need to mention that array value must specific a `ruleType: 'array'` to make default rules work
       */
      ruleType?: RuleType

      /**
       * @description normally is string or string array.
       * But with locale implement, need to specify show help message, which means a boolean.
       */
      labelHelpMessage?: string | string[] | boolean

      /**
       * @description Used for localed form item which do not need to locale with the whole form
       * TRUE when localeUniqueKey has value, specify FALSE when no need to locale the label or labelHelpMessage.
       */
      locale?: boolean

      /**
       * @description Used for form related to a localed table
       */
      localeWithTable?: boolean

      /**
       * @description Used for render/slot typed item, whether apply the default base rules
       * @deprecated
       */
      baseRuleApplied?: boolean
    }

    interface DynamicSchemaItemProps<
      T extends keyof ComponentPropPool<D>,
      D,
      EP = any,
    > {
      /**
       * @description internal flag to control show
       */
      _internalShow?: boolean

      type: T

      componentProp?: ComponentPropPool<D>[T]
        & DomProps & {
        /**
         * @description Even though most naive-ui component already has `defaultValue` prop, some custom components do not have one, so we maually add it to support ts better
         */
          defaultValue?: DefaultValue

          placeholder?: string
        }

      formProp?: SchemaItemFormProps<D>

      /**
       * @description grid prop
       * @link https://www.naiveui.com/zh-CN/os-theme/components/grid#GridItem-Props
       */
      gridProp?: {
        span?: number
        offset?: number
        suffix?: boolean
        class?: string
        style?: CSSProperties
      }

      /**
       * @description Customize form item transition
       */
      transitionProp?: Omit<Partial<ICompExtraTransitionProps>, 'group'>

      /**
       * @description v-if/v-show control
       * Also scoped `visibleMode` supported, override the same galobal prop on form
       */
      visibleProp?: {
        /**
         * @description v-if control visible
         */
        vIf?: boolean | FormFnCallback<D, boolean>

        /**
         * @description v-show control visible
         */
        vShow?: boolean | FormFnCallback<D, boolean>

        /**
         * @description v-if/v-show form item visible position mode
         */
        visibleMode?: FormVisibleMode
      }

      /**
       * @description Extra Prop placeholder for component
       */
      extraProp?: Partial<EP>

      descriptionProp?: Partial<ICompUIDescriptionsItem<D>>
    }

    namespace SchemaItem {

      type RoleSelectSchema<D> = DynamicSchemaItemProps<'Extend:RoleSelect', D>

      type TinymceSchema<D> = DynamicSchemaItemProps<'Vendor:Tinymce', D>

      // base
      type RenderSchema<D> = DynamicSchemaItemProps<'Base:Render', D>
      type SlotSchema<D> = DynamicSchemaItemProps<'Base:Slot', D>

      // ui
      type ButtonSchema<D> = DynamicSchemaItemProps<'Base:Button', D>
      type ButtonConfirmSchema<D> = DynamicSchemaItemProps<'Base:ButtonConfirm', D>
      type ButtonGroupSchema<D> = DynamicSchemaItemProps<'Base:ButtonGroup', D>
      type ButtonRetry<D> = DynamicSchemaItemProps<'Base:ButtonRetry', D>
      type CheckboxSchema<D> = DynamicSchemaItemProps<'Base:Checkbox', D>
      type ColorPickerSchema<D> = DynamicSchemaItemProps<'Base:ColorPicker', D>
      type DatePickerSchema<D> = DynamicSchemaItemProps<'Base:DatePicker', D>
      type DynamicTagsSchema<D> = DynamicSchemaItemProps<'Base:DynamicTags', D>
      type InputSchema<D> = DynamicSchemaItemProps<'Base:Input', D>
      type InputNumberSchema<D> = DynamicSchemaItemProps<'Base:InputNumber', D>
      type RadioSchema<D> = DynamicSchemaItemProps<'Base:Radio', D>
      type SelectSchema<D> = DynamicSchemaItemProps<'Base:Select', D>
      type SwitchSchema<D> = DynamicSchemaItemProps<'Base:Switch', D>
      type TimePickerSchema<D> = DynamicSchemaItemProps<'Base:TimePicker', D>
      type TreeSchema<D> = DynamicSchemaItemProps<'Base:Tree', D>
      type TreeSelectSchema<D> = DynamicSchemaItemProps<'Base:TreeSelect', D>

      // extra
      type EmailInputSchema<D> = DynamicSchemaItemProps<'Extra:EmailInput', D>
      type IconPickerSchema<D> = DynamicSchemaItemProps<'Extra:IconPicker', D>
      type LocaleSchema<D> = DynamicSchemaItemProps<'Extra:LocaleSelect', D>
      type PasswordSchema<D> = DynamicSchemaItemProps<'Extra:Password', D>
      type PhoneNumberInputSchema<D> = DynamicSchemaItemProps<'Extra:PhoneNumberInput', D>
      type VerifyCodeSchema<D> = DynamicSchemaItemProps<'Extra:VerifyCode', D>
      type TransitionSelectSchema<D> = DynamicSchemaItemProps<'Extra:TransitionSelect', D>

      // raw
      type DynamicInputSchema<D> = DynamicSchemaItemProps<'Raw:DynamicInput', D>
      type SliderSchema<D> = DynamicSchemaItemProps<'Raw:Slider', D>

      // business
      type AreaCacaderSchema<D> = DynamicSchemaItemProps<'Business:AreaCascader', D>
      type DictSchema<D> = DynamicSchemaItemProps<'Business:Dict', D>

      // extend
      type QuerySchema<D> = DynamicSchemaItemProps<'Extend:Query', D>
      type DividerSchema<D> = DynamicSchemaItemProps<'Extend:Divider', D, {
        // since sticky element will got a transparent background, so we need to provide a bgColor
        sticky: boolean
        bgColor: string
      }>
    }

    type Item<D>
      = | SchemaItem.DividerSchema<D>

        | SchemaItem.RoleSelectSchema<D>
        | SchemaItem.TinymceSchema<D>

      // base
        | SchemaItem.RenderSchema<D>
        | SchemaItem.SlotSchema<D>

      // ui
        | SchemaItem.ButtonSchema<D>
        | SchemaItem.ButtonConfirmSchema<D>
        | SchemaItem.ButtonGroupSchema<D>
        | SchemaItem.ButtonRetry<D>
        | SchemaItem.CheckboxSchema<D>
        | SchemaItem.ColorPickerSchema<D>
        | SchemaItem.DatePickerSchema<D>
        | SchemaItem.DynamicTagsSchema<D>
        | SchemaItem.InputSchema<D>
        | SchemaItem.InputNumberSchema<D>
        | SchemaItem.RadioSchema<D>
        | SchemaItem.SelectSchema<D>
        | SchemaItem.SwitchSchema<D>
        | SchemaItem.TimePickerSchema<D>
        | SchemaItem.TreeSchema<D>
        | SchemaItem.TreeSelectSchema<D>

      // extra
        | SchemaItem.EmailInputSchema<D>
        | SchemaItem.IconPickerSchema<D>
        | SchemaItem.LocaleSchema<D>
        | SchemaItem.PasswordSchema<D>
        | SchemaItem.PhoneNumberInputSchema<D>
        | SchemaItem.VerifyCodeSchema<D>
        | SchemaItem.TransitionSelectSchema<D>

      // raw
        | SchemaItem.DynamicInputSchema<D>
        | SchemaItem.SliderSchema<D>

      // business
        | SchemaItem.AreaCacaderSchema<D>
        | SchemaItem.DictSchema<D>

      // extend
        | SchemaItem.QuerySchema<D>
  }
}
