<script lang="ts" setup>
import type { IStoreApp } from '@/store/types'
import { useSortable } from '@vueuse/integrations/useSortable'
import { getTabsContext } from '../hooks/useTabsContext'
import TabsItem from './tabsItem.vue'

const appStoreTab = useAppStoreTab()
const appSetting = useAppStoreSetting()

const sortableRef = useTemplateRef<HTMLDivElement>('sortableRef')

const { start, stop } = useSortable(sortableRef, appStoreTab.tabs, {
  animation: 500,
  easing: 'linear',
  draggable: '.tab-draggable',
  onEnd: (evt) => {
    const { oldIndex, newIndex } = evt

    appStoreTab.changeTabOrder(oldIndex!, newIndex!)
  },
})

watchEffect(() => {
  if (appSetting.tabs.sortable)
    start()

  else
    stop()
})

const AppConstTabStyleModeInside = AppConstTabStyleMode

const isCardType = computed(() => appSetting.tabs.styleMode === AppConstTabStyleModeInside.CARD)
const isFlexType = computed(() => appSetting.tabs.styleMode === AppConstTabStyleModeInside.FLEX)
const isRoundType = computed(() => appSetting.tabs.styleMode === AppConstTabStyleModeInside.ROUND)

const {
  scrollRef,
  onTabClick,
  onTabRemove,
  onOpenCtxMenu,
  onCloseCtxMenu,

  currentMouseTab,
  currentMouseTabIndex,
  getTabsWidth,
} = getTabsContext()

function onOpenContextMenu(e: MouseEvent, item: IStoreApp.Tab.Item, index: number) {
  currentMouseTab.value = item
  currentMouseTabIndex.value = index

  // open ctx menu
  onOpenCtxMenu(e)
}

function onMouseUp(e: MouseEvent, name: string) {
  // middle button close
  // 1 stands for mouse middle button
  if (e.button === 1) {
    const isRemoveable = !appStoreTab.tabs
      .filter(i => i.meta.affix)
      .map(i => i.name)
      .includes(name)

    isRemoveable && onTabRemove(name)
  }
}
</script>

<template>
  <WScrollbar
    ref="scrollRef"
    x-scrollable
    :x-step="50"
    :height="`${appSetting.tabs.height}px`"
    :scrollbar="false"
    :width="getTabsWidth"
    @scroll="onCloseCtxMenu"
  >
    <div
      ref="sortableRef"
      class="h-full hstack items-center"
      :class="[
        {
          'divide-x-1 divide-gray-400': isCardType,
          'gap-x-1': isRoundType,
        },
      ]"
    >
      <WTransition appear :transition-name="appSetting.tabs.itemTransition" group>
        <div
          v-for="(item, index) in appStoreTab.tabs"
          :key="item.name"
          class="my-1 h-full"
          :class="[
            $route.name === item.name && 'text-primary',

            /* card */
            isCardType && !appSetting.app.reducedMotion && 'hvr-sweep-to-right',
            isCardType
              && $route.name === item.name
              && 'bg-primary !text-bodyColor',

            /* flex */
            isFlexType
              && !appSetting.app.reducedMotion
              && 'hvr-underline-from-left',
            isFlexType
              && $route.name === item.name
              && 'border-b-1 border-primaryHover',

            /* round */
            isRoundType
              && `${
                !appSetting.app.reducedMotion ? 'hvr-round-corners' : ''
              } rounded border-0.5 border-solid border-primaryHover`,
            isRoundType && $route.name === item.name && 'rounded-2xl',

            {
              'tab-draggable': !item.meta.affix,
            },
          ]"
          @click="onTabClick(item)"
          @mouseup="onMouseUp($event, item.name)"
          @contextmenu.prevent="onOpenContextMenu($event, item, index)"
        >
          <TabsItem :item="item" :index="index" />
        </div>
      </WTransition>
    </div>
  </WScrollbar>
</template>
