import type { CardProps } from 'naive-ui'

export { default } from './index.vue'

// TODO 000
export interface ICompUICardProps extends /* @vue-ignore */ Omit<CardProps, 'segmented'> {
  headerPreset?: 'collapse' | 'refresh'
  loading?: boolean
  segmented?: boolean | {
    content?: boolean | 'soft'
    footer?: boolean | 'soft'
    action?: boolean | 'soft'
  }
}
