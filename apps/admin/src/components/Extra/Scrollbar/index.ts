import type { ScrollTo } from 'naive-ui/lib/_internal/scrollbar/src/ScrollBar'

export interface ICompExtraScrollbarProps {
  xScrollable?: boolean
  hijackXScrollbar?: boolean
  height?: string
  width?: string
  behavior?: ScrollBehavior
  scrollbar?: boolean
  xStep?: number
}

export interface ICompExtraScrollbarInst {
  scrollTo: ScrollTo
  scrollToStart: () => void
  scrollToEnd: () => void
  scrollToIndex: (index: number) => void
  getIsOverflow: () => boolean
}

export { default } from './index.vue'
