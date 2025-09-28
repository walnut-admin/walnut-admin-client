<script lang="ts" setup>
import TabsContentMain from './components/tabsContentMain.vue'
import TabsContextMenu from './components/tabsContextMenu.vue'
import TabsDevTools from './components/tabsDevTools.vue'
import TabsUtils from './components/tabsUtils.vue'

import { useTabs } from './hooks/useTabs'
import { useTabsActions } from './hooks/useTabsActions'
import { setTabsContext } from './hooks/useTabsContext'
import { useTabsContextMenu } from './hooks/useTabsContextMenu'
import { useTabsDevTools } from './hooks/useTabsDevTools'
import { useTabsPersistent } from './hooks/useTabsPersistent'

import { useTabsUtils } from './hooks/useTabsUtils'

const appStoreSettingDev = useAppStoreSettingDev()
const userStorePreference = useAppStoreUserPreference()
const appStoreAdapter = useAppStoreAdapter()

const { scrollRef, isOverflow, onScrollToCurrentTab, onUpdateOverflow }
  = useTabs()

const getShowUtils = computed(
  () =>
    !appStoreAdapter.isMobile
    && appStoreSettingDev.tabs.showUtils
    && (appStoreSettingDev.tabs.utilsMode === AppConstTabUtilsShowMode.ALWAYS
      || (appStoreSettingDev.tabs.utilsMode === AppConstTabUtilsShowMode.OVERFLOW
        && isOverflow.value)),
)

const getTabsWidth = computed(() =>
  appStoreAdapter.isMobile
    ? '100vw'
    : `calc(100vw - ${appStoreSettingDev.getMenuWidth}px - ${getShowUtils.value ? '120px' : ''})`,
)

const {
  devToolShow,
  currentMouseTab,
  currentMouseTabIndex,
  onOpenDevTool,
  onOpenFile,
} = useTabsDevTools()

const { onTabClick, onTabRemove } = useTabsActions(onUpdateOverflow)

const { x, y, ctxMenuShow, onOpenCtxMenu, onCloseCtxMenu }
  = useTabsContextMenu()

const { leftUtils, rightUtils } = useTabsUtils(
  scrollRef,
  onScrollToCurrentTab,
)

// tab persistent
useTabsPersistent()

// set context
setTabsContext({
  scrollRef,
  onScrollToCurrentTab,

  onTabClick,
  onTabRemove,

  x,
  y,
  ctxMenuShow,
  onOpenCtxMenu,
  onCloseCtxMenu,

  devToolShow,
  currentMouseTab,
  currentMouseTabIndex,
  onOpenDevTool,
  onOpenFile,
  getTabsWidth,
})
</script>

<template>
  <WTransition appear :transition-name="appStoreSettingDev.getTabsTransition">
    <n-layout-header
      v-if="appStoreSettingDev.getTabsShow"
      :id="appStoreSettingDev.getTabsId"
      bordered
      :inverted="userStorePreference.getTabsInverted"
      :style="{ zIndex: 999, height: `${appStoreSettingDev.getTabsHeight}px` }"
    >
      <div class="h-full hstack justify-between">
        <!-- left utils -->
        <WTransition appear transition-name="fade-left">
          <TabsUtils v-if="getShowUtils" class="hstack flex-none justify-start" :lists="leftUtils" />
        </WTransition>

        <!-- main tab content -->
        <TabsContentMain />

        <!-- right utils -->
        <WTransition appear transition-name="fade-right">
          <TabsUtils v-if="getShowUtils" class="hstack flex-none justify-end" :lists="rightUtils" />
        </WTransition>

        <!-- tabs contextmenu -->
        <TabsContextMenu v-if="appStoreSettingDev.getTabsContextMenu" />

        <!-- dev tools -->
        <TabsDevTools />
      </div>
    </n-layout-header>
  </WTransition>
</template>
