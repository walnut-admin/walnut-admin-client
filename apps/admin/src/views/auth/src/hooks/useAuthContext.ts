import type { AuthContext } from '../types'

export const { setContext: setAuthContext, getContext: useAuthContext }
  = useContext<AuthContext>(Symbol(AppConstSymbolKey.AUTH_KEY))
