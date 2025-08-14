import { AppAxios } from '@/utils/axios'

const { httpUrl } = useAppEnvProxy()

export const authCapApiEndpoint = `${httpUrl}/auth/cap/`

const authCap = {
  NEED: '/auth/cap/need',
} as const

/**
 * @description get need to implement capjs component to validate bot
 */
export function getNeedCapAPI(field: 'userName' | 'emailAddress' | 'phoneNumber', value: string) {
  return AppAxios.get<boolean>({
    url: authCap.NEED,
    params: { field, value },
  })
}
