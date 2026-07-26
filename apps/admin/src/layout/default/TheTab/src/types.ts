import type { Nullable } from 'easy-fns-ts'
import type { ICompExtraScrollbarInst } from '@/components/Extra/Scrollbar'
import type { IStoreApp } from '@/store/types'

export interface AppTabUtilListItem {
  icon: string
  helpMessage: Fn<void, string>
  event: Fn
}

export interface AppTabContext {
  scrollRef: Ref<Nullable<ICompExtraScrollbarInst>>
  onScrollToCurrentTab: Fn

  x: Ref<number>
  y: Ref<number>
  ctxMenuShow: Ref<boolean>

  onTabClick: (item: IStoreApp.Tab.Item) => void
  onTabRemove: (name: string, type?: ValueOfAppConstTabDeleteType) => void

  onOpenCtxMenu: (event: MouseEvent) => void
  onCloseCtxMenu: () => void

  devToolShow: Ref<boolean>
  currentMouseTab: Ref<IStoreApp.Tab.Item | undefined>
  currentMouseTabIndex: Ref<number>
  onOpenDevTool: Fn
  onOpenFile: Fn
  getTabsWidth: ComputedRef<string>
}
