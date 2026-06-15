export { default } from './index.vue'

export interface ICompExtraQRCodeProps {
  size?: number
  padding?: number
  url: string
  expireSeconds?: number
  success?: boolean
}
