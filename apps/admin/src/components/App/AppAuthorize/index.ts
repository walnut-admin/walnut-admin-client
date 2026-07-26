export { default } from './index.vue'

export type IAppAuthorizePreset = 'null' | 'tip' | 'IPTC'

export interface IAppAuthorizeProps {
  value?: string
  preset?: IAppAuthorizePreset
  presetWidth?: string
  presetHeight?: string
}

export interface IAppAuthorizeIPTCProps extends Omit<IAppAuthorizeProps, 'preset'> { }
