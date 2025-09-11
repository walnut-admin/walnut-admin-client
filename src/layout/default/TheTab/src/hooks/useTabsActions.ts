import type { IStoreApp } from '@/store/types'

export function useTabsActions(onUpdateOverflow: Fn) {
  const appStoreTab = useAppStoreTab()

  const onTabClick = async (item: IStoreApp.Tab.Item) => {
    // push by name
    await appStoreTab.goTab(item.name, item.query, item.params)
  }

  const onTabRemove = async (
    name: string,
    type: ValueOfAppConstTabDeleteType = AppConstTabDeleteType.TAB_SINGLE,
  ) => {
    // remove tab
    await appStoreTab.deleteTabs(name, type)

    // TODO
    const { stop } = useTimeoutFn(() => {
      onUpdateOverflow()
      stop()
    }, 1000)
  }

  return {
    onTabClick,
    onTabRemove,
  }
}
