import type { AppTabContext } from '../types'
import { tabsKey } from '../utils/InjectionKey'

export const { setContext: setTabsContext, getContext: getTabsContext }
  = useContext<AppTabContext>(tabsKey)
