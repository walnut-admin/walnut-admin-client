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
  name: 'TheScrollContent',
})

const appStoreSettingDev = useAppStoreSettingDev()

const { scrollWrapper, top, bottom, directionTop, y } = useScrollWrapper()

const { targetRef: headerRef, targetShow: headerShow } = useFixedTopScroll('headerRef', toRefs(appStoreSettingDev.header), { top, y, directionTop })
const { targetRef: tabsRef, targetShow: tabsShow } = useFixedTopScroll('tabsRef', toRefs(appStoreSettingDev.tabs), { top, y, directionTop })

watchEffect(() => {
  headerShow.value = appStoreSettingDev.getHeaderShow
    ? top.value || appStoreSettingDev.getHeaderFixed
    : false
})

watchEffect(() => {
  tabsShow.value = appStoreSettingDev.getTabsShow
    ? top.value || appStoreSettingDev.getTabsFixed
    : false
})

const footerAtBottom = computed(() => bottom.value || appStoreSettingDev.getFooterFixed)
const isFooterVisible = ref(footerAtBottom.value)
let footerHideTimer: ReturnType<typeof setTimeout> | null = null

// TODO header/tab/footer 都是fixed false 滚动到最底部 稍微往上滚动一下 footer和顶栏的header/tab就出现了循环显示逻辑
// 暂时通过下面的timer很蠢的方式处理有点效果
watch(footerAtBottom, (v) => {
  if (v) {
    if (footerHideTimer) {
      clearTimeout(footerHideTimer)
      footerHideTimer = null
    }
    isFooterVisible.value = true
  }
  else {
    footerHideTimer = setTimeout(() => {
      isFooterVisible.value = false
      footerHideTimer = null
    }, 400)
  }
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div
      class="shrink-0 overflow-hidden transition-all duration-300"
      :style="{
        maxHeight: headerShow ? `${appStoreSettingDev.getHeaderHeight}rem` : '0',
        opacity: headerShow ? 1 : 0,
      }"
    >
      <TheHeader ref="headerRef" />
    </div>

    <div
      class="shrink-0 overflow-hidden transition-all duration-300"
      :style="{
        maxHeight: tabsShow ? `${appStoreSettingDev.getTabsHeight}rem` : '0',
        opacity: tabsShow ? 1 : 0,
      }"
    >
      <TheTabs ref="tabsRef" />
    </div>

    <div ref="scrollWrapper" class="min-h-0 flex-1">
      <n-scrollbar
        :id="String($route.name)"
        x-scrollable
        :style="{
          width: appStoreSettingDev.getCalcContentWidth,
          height: '100%',
        }"
      >
        <div
          :id="`${String($route.name)}-content`"
          class="h-full"
          :style="{
            width: appStoreSettingDev.getCalcContentWidth,
            padding: $route.meta.ternal === 'internal' ? 0 : `${appStoreSettingDev.getContentPadding}rem`,
          }"
        >
          <TheContent />
          <TheIFrameWrapper />
        </div>
      </n-scrollbar>
    </div>

    <div
      class="shrink-0 overflow-hidden transition-all duration-300"
      :style="{
        maxHeight: isFooterVisible ? `${appStoreSettingDev.getFooterHeight}rem` : '0',
        opacity: isFooterVisible ? 1 : 0,
      }"
    >
      <TheFooter />
    </div>

    <TheAppBackToTop />
  </div>
</template>
