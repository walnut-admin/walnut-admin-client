import type { SelectProps, TooltipProps } from 'naive-ui'

import type { WithValueProp } from '@/components/HOC/WithValue'
import { WithValue } from '@/components/HOC/WithValue'
import RawWSelect from './index.vue'

export default WithValue<ICompUISelectProps>(RawWSelect)

// TODO 000
export interface ICompUISelectProps extends /* @vue-ignore */ SelectProps, /* @vue-ignore */ Omit<WithValueProp, 'value' | 'multiple'> {
  tooltip?: boolean
  tooltipThreshold?: number
  tooltipProps?: TooltipProps
}
