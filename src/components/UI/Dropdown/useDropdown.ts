import type { ICompUIDropdownInst, ICompUIDropdownProps } from '.'
import { isInSetup } from '@/utils/shared'

export function useDropdown(props: IDeepMaybeRef<ICompUIDropdownProps> | ICompUIDropdownProps): [(inst: ICompUIDropdownInst) => void, ICompUIDropdownInst] {
  isInSetup()

  const wDropdownRef = shallowRef<ICompUIDropdownInst>()

  const register = (inst: ICompUIDropdownInst) => {
    wDropdownRef.value = inst
  }

  watchEffect(() => {
    props && wDropdownRef.value?.setProps(props)
  })

  const methods: ICompUIDropdownInst = {
    setProps: props => wDropdownRef.value?.setProps!(props),
    openDropdown: e => wDropdownRef.value?.openDropdown!(e),
    closeDropdown: () => wDropdownRef.value?.closeDropdown!(),
  }

  return [register, methods]
}
