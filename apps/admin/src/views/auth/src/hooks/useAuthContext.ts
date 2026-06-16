import type { AuthContext } from '../types'
import { useContext } from '@walnut/core/hooks/core/useContext'

export const { setContext: setAuthContext, getContext: useAuthContext }
  = useContext<AuthContext>(Symbol(AppConstSymbolKey.AUTH_KEY))
