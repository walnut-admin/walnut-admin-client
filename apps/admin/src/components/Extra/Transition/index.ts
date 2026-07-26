export { default } from './index.vue'

export type ICompExtraTransitionMode = 'in-out' | 'out-in'

export interface ICompExtraTransitionProps {
  transitionName?: ValueOfAppConstTransitionName
  mode?: ICompExtraTransitionMode
  group?: boolean
  appear?: boolean
  duration?: number
}
