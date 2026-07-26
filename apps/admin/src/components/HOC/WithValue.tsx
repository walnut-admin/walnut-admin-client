import type { BaseDataType, StringOrNumber } from 'easy-fns-ts'
import type { ExtractPropTypes } from 'vue'
import { omit } from 'lodash-es'

export const WithValueProps = {
  value: [String, Number, Boolean, Array] as PropType<
    string | number | boolean | string[] | number[] | boolean[] | BaseDataType[]
  >,

  multiple: Boolean as PropType<boolean>,

  valueType: {
    type: String as PropType<'string' | 'number' | 'boolean'>,
    default: 'string',
  },

  valueSeparator: String as PropType<string>,
} as const

export type WithValueProp = Partial<ExtractPropTypes<typeof WithValueProps>>

export function WithValue<T>(WrappedComponent: ReturnType<typeof defineComponent>) {
  return defineComponent<WithValueProp & T>({
    name: 'WithValue',

    props: WithValueProps,

    emits: ['update:value'],

    setup(p, { emit, slots }) {
      const v = ref()

      const props = p as unknown as WithValueProp

      const formateDefaultValue = (fn: Fn) => {
        !props.valueSeparator
          ? (v.value = (props.value as string[]).map(ov => fn(ov)))
          : (v.value
              = props.value
                && (props.value as string)
                  .split(props.valueSeparator)
                  .map(ov => fn(ov)))
      }

      const transformBoolean = (val: any) => {
        if (props.valueType === 'string') {
          if (val === true)
            return 'true'
          if (val === false)
            return 'false'
        }

        if (props.valueType === 'boolean') {
          if (val === 'true')
            return true
          if (val === 'false')
            return false
          return val
        }
      }

      watch(
        () => props.value,
        (newV) => {
          if ([null, undefined, '', Number.NaN].includes(newV as any)) {
            v.value = null
            return
          }

          if (props.multiple === true) {
            if (props.valueType === 'string')
              formateDefaultValue(ov => ov.toString())
            else if (props.valueType === 'number')
              formateDefaultValue(ov => +ov)
            else if (props.valueType === 'boolean')
              formateDefaultValue(ov => transformBoolean(ov))
          }
          else {
            if (props.valueType === 'string')
              v.value = `${newV}`
            else if (props.valueType === 'number')
              v.value = +newV!
            else if (props.valueType === 'boolean')
              v.value = transformBoolean(newV)
          }
        },
        {
          deep: true,
          immediate: true,
        },
      )

      const onUpdateValue = (val: StringOrNumber[]) => {
        v.value = val
        emit(
          'update:value',
          props.valueType === 'boolean'
            ? transformBoolean(val)
            : !props.valueSeparator
                ? val
                : val.join(props.valueSeparator),
        )
      }

      return () => (
        <WrappedComponent
          {...omit(props, ['valueType', 'valueSeparator'])}
          value={v.value}
          onUpdateValue={onUpdateValue}
        >
          {slots}
        </WrappedComponent>
      )
    },
  })
}
