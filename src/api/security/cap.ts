import { AppAxios } from '@/utils/axios'

const { httpUrl } = useAppEnvProxy()

export const securityCapApiEndpoint = `${httpUrl}/security/cap/`

const securityCap = {
  NEED: '/security/cap/need',
} as const

/**
 * @description get need to implement capjs component to validate bot
 */
export function getNeedCapAPI(field: 'userName' | 'emailAddress' | 'phoneNumber', value: string) {
  return AppAxios.get<boolean>({
    url: securityCap.NEED,
    params: { field, value },
  })
}
