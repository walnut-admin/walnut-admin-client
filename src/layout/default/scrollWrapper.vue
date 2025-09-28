<script lang="ts" setup>
import TheIFrameWrapper from '../iframe/wrapper.vue'
import TheAppBackToTop from './Features/backToTop.vue'
import { useFixedTopScroll } from './hooks/useFixedTopScroll'
import { useScrollWrapper } from './hooks/useScrollWrapper'
import TheContent from './TheContent'
import TheFooter from './TheFooter'
import TheHeader from './TheHeader'
import TheTabs from './TheTab'

defineOptions({
  name: 'TheScrollWrapper',
})

const appStoreSettingDev = useAppStoreSettingDev()

const { scrollWrapper, top, directionTop, y } = useScrollWrapper()

const { targetRef: headerRef, targetShow: headerShow } = useFixedTopScroll('headerRef', toRefs(appStoreSettingDev.header), { top, y, directionTop })
const { targetRef: tabsRef, targetShow: tabsShow } = useFixedTopScroll('tabsRef', toRefs(appStoreSettingDev.tabs), { top, y, directionTop })

watchEffect(() => {
  headerShow.value = top.value || appStoreSettingDev.getHeaderFixed
  tabsShow.value = top.value || appStoreSettingDev.getTabsFixed
})
</script>

<template>
  <div ref="scrollWrapper" class="relative h-full">
    <n-scrollbar
      :id="String($route.name)"
      x-scrollable
      content-class="grid grid-rows-1"
    >
      <div
        class="fixed left-0 top-0 z-99 w-full transition-transform duration-300 ease-in-out -translate-y-[100%]"
        :class="[{ 'translate-y-0': headerShow }]"
        :style="{ 'padding-left': `${appStoreSettingDev.getMenuWidth}px` }"
      >
        <TheHeader ref="headerRef" />
      </div>

      <div
        class="fixed left-0 top-0 z-98 w-full transition-transform duration-500 ease-in-out -translate-y-[100%]"
        :class="[{ 'translate-y-0': tabsShow }]"
        :style="{
          'top': appStoreSettingDev.getHeaderShow && (headerShow && tabsShow || headerShow && appStoreSettingDev.getTabsFixed) ? `${appStoreSettingDev.getHeaderHeight}px` : '',
          'padding-left': `${appStoreSettingDev.getMenuWidth}px`,
        }"
      >
        <TheTabs ref="tabsRef" />
      </div>

      <div
        :id="`${String($route.name)}-content`"
        class="relative"
        :style="{
          'width': appStoreSettingDev.getCalcContentWidth,
          'minHeight': `calc(100vh - ${appStoreSettingDev.getFooterHeight}px)`,
          'padding': $route.meta.ternal === 'internal' ? 0 : `${appStoreSettingDev.getContentPadding}px`,
          'padding-top': $route.meta.ternal === 'internal' ? `${appStoreSettingDev.getHeaderHeight + appStoreSettingDev.getTabsHeight}px` : `${appStoreSettingDev.getHeaderHeight + appStoreSettingDev.getTabsHeight + appStoreSettingDev.getContentPadding}px`,
        }"
      >
        <TheContent />
        <TheIFrameWrapper />
      </div>

      <div class="sticky left-0 z-97" :class="[{ 'bottom-0': appStoreSettingDev.getFooterFixed }]" :style="{ width: appStoreSettingDev.getCalcContentWidth }">
        <TheFooter />
      </div>
    </n-scrollbar>

    <TheAppBackToTop />
  </div>
</template>
