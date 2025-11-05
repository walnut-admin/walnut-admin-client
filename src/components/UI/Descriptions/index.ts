import type { BaseDataType } from 'easy-fns-ts'
import type { DescriptionItemProps, DescriptionsProps, TagProps, TextProps } from 'naive-ui'
import type { ICompExtraJSONProps } from '@/components/Extra/JSON'

export { default } from './index.vue'

export interface ICompUIDescTypeTag<T> extends ICompUIDescItemExtend<T, TagProps> {
  type?: 'tag'
}

export interface ICompUIDescTypeLink<T> extends ICompUIDescItemExtend<T, TextProps & {
  link?: string
  onLinkClick?: (val: BaseDataType, record?: T) => void
}> {
  type?: 'link'
}

export interface ICompUIDescTypeJson<T> extends ICompUIDescItemExtend<T, ICompExtraJSONProps> {
  type?: 'json'
}

export interface ICompUIDescTypeDict<T> extends ICompUIDescItemExtend<T, { dictType?: string }> {
  type?: 'dict'
}

export interface ICompUIDescItemExtend<T, P> extends DescriptionItemProps {
  key?: string
  show?: boolean
  value: BaseDataType
  copy?: boolean
  formatter?: (val: BaseDataType, record?: T) => string
  typeProps?: P
}

export type ICompUIDescriptionsItem<D = any>
  = ICompUIDescTypeTag<D> | ICompUIDescTypeLink<D> | ICompUIDescTypeJson<D> | ICompUIDescTypeDict<D>

export interface ICompUIDescriptionProps extends /* @vue-ignore */ DescriptionsProps {
  items: ICompUIDescriptionsItem[]
  colon?: boolean
}
