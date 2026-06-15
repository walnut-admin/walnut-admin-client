import type { DropdownProps } from 'naive-ui'

export { default } from './index.vue'

export * from './useDropdown'

export interface ICompUIDropdownProps {
  dropdownProps?: DropdownProps
}

export interface ICompUIDropdownInst {
  setProps: IHooksUseProps<ICompUIDropdownProps>['setProps']

  openDropdown: (e: MouseEvent) => void

  closeDropdown: () => void
}
