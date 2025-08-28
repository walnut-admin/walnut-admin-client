import type { ICompExtraScrollbarInst } from '@/components/Extra/Scrollbar'
import type { Nullable } from 'easy-fns-ts'

/**
 * @description App Tab Core Function
 */
export function useTabs() {
  const appStoreTab = useAppStoreTab()
  const appStoreAdapter = useAppStoreAdapter()

  const route = useAppRoute()
  const { currentRoute } = useAppRouter()

  const scrollRef = ref<Nullable<ICompExtraScrollbarInst>>(null)
  const isOverflow = ref(false)

  const getCurrentRouteTabIndex = computed(() =>
    appStoreTab.tabs.findIndex(item => item.name === currentRoute.value.name),
  )

  const onScrollToCurrentTab = async () => {
    await nextTick()

    // scroll by index
    // If is mobile, just scroll to current route tab index
    scrollRef.value?.scrollToIndex(appStoreAdapter.isMobile
      ? getCurrentRouteTabIndex.value
      : appStoreTab.leaveRoomForTabs(getCurrentRouteTabIndex.value))
  }

  const onUpdateOverflow = () => {
    isOverflow.value = scrollRef.value?.getIsOverflow() as boolean
  }

  watch(
    () => route,
    async (v) => {
      // Build tab
      appStoreTab.createTabs(appStoreTab.createTabByRoute(v))

      await nextTick()

      // use device to trigger Scroll
      appStoreAdapter.getDevice && await onScrollToCurrentTab()
    },
    {
      immediate: true,
      deep: true,
    },
  )

  watch(
    () => appStoreTab.tabs,
    async () => {
      await nextTick()
      onUpdateOverflow()
    },
    {
      deep: true,
      immediate: true,
    },
  )

  return {
    scrollRef,
    isOverflow,
    onUpdateOverflow,
    onScrollToCurrentTab,
  }
}
