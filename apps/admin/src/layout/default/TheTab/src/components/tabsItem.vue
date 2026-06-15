<script lang="ts" setup>
import type { IStoreApp } from '@/store/types'
import { getTabsContext } from '../hooks/useTabsContext'

defineOptions({
  name: 'TabsItem',
})

const { item } = defineProps<{ item: IStoreApp.Tab.Item, index: number }>()

const { t } = useAppI18n()
const { currentRoute } = useAppRouter()

const appStoreAdapter = useAppStoreAdapter()
const appStoreSettingDev = useAppStoreSettingDev()
const userStorePreference = useAppStoreUserPreference()

const tabsItem = useTemplateRef('tabsItem')
const isHovered = useElementHover(tabsItem)
const getHovered = computed(() => isHovered.value || item.meta._hovered)

const { onTabRemove } = getTabsContext()

// only show when not mobile
// and
// only show when tab affixed
// and
// pnly show when affix mode is pin
const getShowAffixedPinIcon = computed(
  () =>
    !appStoreAdapter.isMobile
    && item.meta.affix
    && userStorePreference.getTabsAffixMode === AppConstTabAffixMode.PIN,
)

// only show when tab not affixed and showIcon is true
// or
// only show when tab is affixed and affix mode is icon
const getShowIcon = computed(
  () =>
    (!item.meta.affix && userStorePreference.getTabsShowIcon)
    || (item.meta.affix
      && userStorePreference.getTabsAffixMode === AppConstTabAffixMode.ICON),
)

// only show when not mobile
// and
// only show when tab not affixed
// and
// only show when showIcon is true
// and
// current tab
const getShowDot = computed(
  () =>
    !appStoreAdapter.isMobile
    && !item.meta.affix
    && !userStorePreference.getTabsShowIcon
    && currentRoute.value.name === item.name,
)

// only show when tab is not affixed
// and
// tab close mode is always or when close mode is hover and is hovered
const getShowCloseIcon = computed(
  () =>
    !item.meta.affix
    && (userStorePreference.getTabsCloseMode === AppConstTabCloseMode.ALWAYS
      || (userStorePreference.getTabsCloseMode === AppConstTabCloseMode.HOVER
        && getHovered.value)),
)

// only show when tab is not affixed
// or
// tab is affixed and affix mode is pin
const getShowTite = computed(
  () =>
    !item.meta.affix
    || (item.meta.affix
      && userStorePreference.getTabsAffixMode === AppConstTabAffixMode.PIN),
)

// scroll title and real title
const getTitle = computed(() => {
  const title = item.meta?._title ?? item.meta?.title as string
  return title ? t(title) : ''
})

const getIcon = computed(() => {
  const icon = item.meta?._icon ?? item.meta?.icon as string
  return icon || ''
})
</script>

<template>
  <div
    ref="tabsItem"
    :style="{
      width: getShowTite ? `${appStoreSettingDev.tabs.itemWidth}rem` : 'max-content',
    }"
    class="relative grid grid-cols-12 h-full cursor-pointer select-none items-center gap-1 gap-x-2 px-2 py-1"
    :class="[
      {
        '!grid-cols-2': !getShowTite,
      },
    ]"
  >
    <WIcon
      v-if="getShowAffixedPinIcon"
      height="16"
      icon="ant-design:pushpin-filled"
      class="col-span-2 flex items-center"
    />

    <div
      v-else-if="getShowDot"
      class="col-span-2 h-4 w-4 flex items-center border-8 border-info rounded-full bg-info text-xl font-bold shadow-xl hover:border-infoHover"
      :class="[
        { 'animate-bounce': getHovered },
      ]"
    />

    <WIcon
      v-if="getIcon && getShowIcon"
      :icon="getIcon"
      class="col-span-2 flex items-center"
      height="16"
      :class="[
        { 'animate-bounce': item.meta._icon_animate },
        { 'animate-duration-1000': item.meta._icon_animate_duration === 1000 },
        { 'animate-duration-2000': item.meta._icon_animate_duration === 2000 },
        { 'animate-duration-3000': item.meta._icon_animate_duration === 3000 },
        { 'animate-duration-4000': item.meta._icon_animate_duration === 4000 },
      ]"
    />

    <!-- main text -->
    <WTransition appear transition-name="fade-left" :duration="100">
      <div
        v-if="getShowTite"
        class="col-span-10 truncate whitespace-nowrap text-sm"
        :class="[
          { 'pr-4': getShowCloseIcon },
        ]"
      >
        <WTextScroll
          :texts="[getTitle]"
          :max-length="item.meta._title_maxLength ?? 16"
          :speed="item.meta._title_speed"
        />
      </div>
    </WTransition>

    <!-- close -->
    <WTransition appear transition-name="fade-right">
      <WIcon
        v-if="getShowCloseIcon"
        height="16"
        icon="ant-design:close-outlined"
        class="absolute right-1 hover:(scale-125 transform rounded-full text-error)"
        @click.prevent.stop="onTabRemove(item.name)"
      />
    </WTransition>
  </div>
</template>
