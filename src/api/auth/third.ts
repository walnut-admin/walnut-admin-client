import { AppAxios } from '@/utils/axios'

const oauthThird = {
  GITHUB: '/auth/oauth/github/url',
  GITEE: '/auth/oauth/gitee/url',
} as const

/**
 * @description get github oauth uri
 */
export function getGitHubURIAPI() {
  return AppAxios.get<string>({
    url: oauthThird.GITHUB,
  })
}

/**
 * @description get gitee oauth uri
 */
export function getGiteeURIAPI() {
  return AppAxios.get<string>({
    url: oauthThird.GITEE,
  })
}
