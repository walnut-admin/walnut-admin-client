import { AppAxios } from '@/utils/axios'

const oauthThird = {
  GITHUB: '/auth/oauth/github/url',
  GITEE: '/auth/oauth/gitee/url',
  WEIBO: '/auth/oauth/weibo/url',
} as const

/**
 * @description get github oauth uri
 */
export function getGitHubURIAPI() {
  return AppAxios.get<{ uri: string }>({
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

/**
 * @description get weibo oauth uri
 */
export function getWeiboURIAPI() {
  return AppAxios.get<string>({
    url: oauthThird.WEIBO,
  })
}
