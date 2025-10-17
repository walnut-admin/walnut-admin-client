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

const getFooterShow = computed(() => bottom.value || appStoreSettingDev.getFooterFixed)

// shit code but fix the problem
watch(() => getFooterShow.value, async (v) => {
  if (v) {
    await nextTick()
    scrollWrapper.value?.scrollTo({
      top: scrollWrapper.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="relative h-full w-full transition-all">
    <div class="sticky left-0 top-0 z-99">
      <TheHeader v-show="headerShow" ref="headerRef" />
    </div>

    <div class="sticky left-0 top-0 z-98">
      <TheTabs v-show="tabsShow" ref="tabsRef" />
    </div>

    <div ref="scrollWrapper">
      <n-scrollbar
        :id="String($route.name)"
        x-scrollable
        :style="{
          width: appStoreSettingDev.getCalcContentWidth,
          height: appStoreSettingDev.getCalcContentHeight,
        }"
      >
        <div
          :id="`${String($route.name)}-content`"
          class="relative h-full w-full"
          :style="{
            width: appStoreSettingDev.getCalcContentWidth,
            padding: $route.meta.ternal === 'internal' ? 0 : `${appStoreSettingDev.getContentPadding}rem`,
            height: $route.meta.ternal === 'internal' ? appStoreSettingDev.getCalcContentHeight : 'initial',
          }"
        >
          <TheContent />
          <TheIFrameWrapper />
        </div>
      </n-scrollbar>
    </div>

    <div class="sticky bottom-0 left-0 z-99">
      <TheFooter v-show="getFooterShow" />
    </div>

    <TheAppBackToTop />
  </div>
</template>
