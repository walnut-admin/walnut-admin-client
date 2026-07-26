import type { TreeInst, TreeProps } from 'naive-ui'
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'

export { default } from './index.vue'

export * from './useTree'

export interface ICompUITreeProps<T> {
  /**
   * @description NTree original props
   */
  treeProps?: TreeProps

  /**
   * @description refer to n-tree checkable
   */
  multiple?: boolean

  /**
   * @description custom tree toolbar
   */
  toolbar?: boolean

  /**
   * @description custom tree toolbar
   */
  deletable?: boolean

  /**
   * @description delete event
   */
  onTreeNodeItemDelete?: (deletedItem: T) => void

  /**
   * @description preset prefix icon, default will take `node.icon` as the icon field
   */
  presetPrefixIcon?: boolean

  /**
   * @description preset context menu, default include copy/paste
   */
  presetContextMenu?: boolean

  /**
   * @description paste event
   */
  onPaste?: (copyTarget: T, currentTarget: T) => void

  /**
   * @description max height, well just a height with scrollbar
   */
  maxHeight?: string

  /**
   * @description extra dropdown options
   */
  extraDropdownOptions?: (Omit<DropdownMixedOption, 'icon' | 'disabled'> & { icon?: string, disabled?: (item: T) => boolean, onClick?: (item: T) => void })[]

  /**
   * @description auth buttono
   */
  auths?: {
    delete?: string

    update?: string
  }
}

export type ICompUITreeInst<T> = Partial<TreeInst & {
  setProps: (p: IDeepMaybeRef<ICompUITreeProps<T>> | ICompUITreeProps<T>) => void
}>
