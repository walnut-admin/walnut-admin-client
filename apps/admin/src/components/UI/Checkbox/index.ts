import type { CheckboxProps } from 'naive-ui'

import type { WithValueProp } from '@/components/HOC/WithValue'
import { WithValue } from '@/components/HOC/WithValue'
import RawWCheckBox from './index.vue'

export default WithValue<ICompUICheckboxProps>(RawWCheckBox)

// TODO 000
export interface ICompUICheckboxProps extends /* @vue-ignore */ CheckboxProps, /* @vue-ignore */ Omit<WithValueProp, 'value'> {
  options: CheckboxProps[]
}
