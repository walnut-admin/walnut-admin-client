import type { ICompUICheckboxProps } from '@/components/UI/Checkbox'
import type { ICompUIRadioProps } from '@/components/UI/Radio'
import type { ICompUISelectProps } from '@/components/UI/Select'

export { default } from './index.vue'

interface ICompBusinessDictSelectProps {
  dictType: string
  renderType?: 'select'
  componentProps?: ICompUISelectProps
}

interface ICompBusinessDictCheckboxProps {
  dictType: string
  renderType?: 'checkbox'
  componentProps?: ICompUICheckboxProps
}

interface ICompBusinessDictRadioProps {
  dictType: string
  renderType?: 'radio'
  componentProps?: ICompUIRadioProps
}

export type ICompBusinessDictProps
  = | ICompBusinessDictSelectProps
    | ICompBusinessDictCheckboxProps
    | ICompBusinessDictRadioProps
