import type { AppTabContext } from '../types'
import { useContext } from '@walnut/core/hooks/core/useContext'
import { tabsKey } from '../utils/InjectionKey'

export const { setContext: setTabsContext, getContext: getTabsContext }
  = useContext<AppTabContext>(tabsKey)
