import type { RadioGroupProps, RadioProps } from 'naive-ui'

import type { WithValueProp } from '@/components/HOC/WithValue'
import { WithValue } from '@/components/HOC/WithValue'
import RawWRadio from './index.vue'

export default WithValue<ICompUIRadioProps>(RawWRadio)

// TODO 000
export interface ICompUIRadioProps extends /* @vue-ignore */ RadioGroupProps, /* @vue-ignore */ Omit<WithValueProp, 'value' | 'multiple'> {
  options?: RadioProps[]
  button?: boolean
}
