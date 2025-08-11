import { fpId } from '@/App/src/scripts/fingerprint'

export const AppSocketEvents = {
  FORCE_QUIT: () => `${fpId.value}/force/quit`,
}
