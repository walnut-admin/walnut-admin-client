<script lang="tsx" setup>
import type { DropdownOption } from 'naive-ui'

import { getThemeOverridesCommon } from '@/App/src/naive/src/theme'
// TODO 111
import WIcon from '@/components/UI/Icon'

import { isDev } from '@/utils/constant/vue'
import { downloadByBase64 } from '@/utils/file/download'

import { openExternalLink } from '@/utils/window/open'
import { toJpeg } from 'html-to-image'
import { getTabsContext } from '../hooks/useTabsContext'

const { t } = useAppI18n()
const { currentRoute } = useAppRouter()

const appTab = useAppStoreTab()
const appSetting = useAppStoreSetting()

const {
  x,
  y,
  onScrollToCurrentTab,
  ctxMenuShow,
  onTabRemove,
  onCloseCtxMenu,
  currentMouseTab,
  currentMouseTabIndex,
  onOpenDevTool,
} = getTabsContext()

const getTabsLength = computed(() => appTab.tabs.length)
const getAffixedTabsLength = computed(
  () => appTab.tabs.filter(i => i.meta.affix).length,
)

// only affixed can not close
const getCloseDisabled = computed(() => currentMouseTab.value?.meta.affix)

// the one closest to the affixed is left disabled
const getCloseLeftDisabled = computed(
  () =>
    getAffixedTabsLength.value === currentMouseTabIndex.value
    || currentMouseTab.value?.meta.affix,
)

// the last one tab is right disabled
const getCloseRightDisabled = computed(
  () =>
    getTabsLength.value - 1 === currentMouseTabIndex.value
    || currentMouseTab.value?.meta.affix,
)

// affixed, only true when all tabs left are affixed
// not affixed, only true when gap is 1, which means only one not affixed tab left
const getCloseOtherDisabled = computed(() =>
  currentMouseTab.value?.meta.affix
    ? getTabsLength.value === getAffixedTabsLength.value
    : getTabsLength.value - 1 === getAffixedTabsLength.value,
)

// refresh and full screen only work in current route tab
const getOtherDisabled = computed(
  () => currentRoute.value.name !== currentMouseTab.value?.name,
)

async function onSelect(key: ValueOfAppConstTabDeleteType &
  'Refresh' &
  'Screen Full' &
  'Fix' &
  'Snapshot' &
  'NewWindow') {
  if (Object.values(AppConstTabDeleteType).includes(key))
    onTabRemove(currentMouseTab.value?.name as string, key)

  if (key === 'Refresh')
    await useRedirect()

  if (key === 'Screen Full') {
    appSetting.toggleLayout(false)
  }

  if (key === 'Fix') {
    appTab.setTabByIndex(currentMouseTabIndex.value, {
      meta: { affix: !currentMouseTab.value?.meta.affix },
    })

    appTab.sortTabs()

    onScrollToCurrentTab()
  }

  if (key === 'Snapshot') {
    try {
      const target = document.getElementById(currentRoute.value.name as string)

      const padding = appSetting.app.contentPadding

      const dataUrl = await toJpeg(target!, {
        width: target?.scrollWidth as number + padding * 2,
        height: target?.scrollHeight as number + padding * 2,
        canvasWidth: target?.scrollWidth as number + padding * 2,
        canvasHeight: target?.scrollHeight as number + padding * 2,
        backgroundColor: getThemeOverridesCommon.value.bodyColor,
        style: {
          margin: `${padding}px`,
        },
      })

      await downloadByBase64(dataUrl, `${currentRoute.value.name as string}-${appSetting.app.scrollMode}`)
    }
    catch (error) {
      console.log(error)
    }
  }

  if (key === 'NewWindow')
    openExternalLink(`${currentMouseTab.value?.path}?full=1`)

  if (key === 'DevTool')
    onOpenDevTool()

  onCloseCtxMenu()
}

const options = computed<DropdownOption[]>(() => [
  {
    key: 'Refresh',
    label: t('app.tab.utils.refresh'),
    icon: () => <WIcon height="24" icon="ant-design:sync-outlined"></WIcon>,
    disabled: getOtherDisabled.value,
  },

  {
    key: 'Screen Full',
    label: t('app.tab.ctx.screenfull'),
    icon: () => (
      <WIcon height="24" icon="ant-design:fullscreen-outlined"></WIcon>
    ),
    disabled: getOtherDisabled.value,
  },

  {
    key: 'd1',
    type: 'divider',
  },

  {
    key: AppConstTabDeleteType.TAB_SINGLE,
    label: t('app.tab.ctx.close'),
    icon: () => <WIcon height="24" icon="ant-design:close-outlined"></WIcon>,
    disabled: getCloseDisabled.value,
  },

  {
    key: AppConstTabDeleteType.TAB_LEFT,
    label: t('app.tab.ctx.closeLeft'),
    icon: () => (
      <WIcon height="24" icon="ant-design:vertical-right-outlined"></WIcon>
    ),
    disabled: getCloseLeftDisabled.value,
  },

  {
    key: AppConstTabDeleteType.TAB_RIGHT,
    label: t('app.tab.ctx.closeRight'),
    icon: () => (
      <WIcon height="24" icon="ant-design:vertical-left-outlined"></WIcon>
    ),
    disabled: getCloseRightDisabled.value,
  },

  {
    key: AppConstTabDeleteType.TAB_OTHER,
    label: t('app.tab.ctx.closeOther'),
    icon: () => (
      <WIcon height="24" icon="ant-design:column-width-outlined"></WIcon>
    ),
    disabled: getCloseOtherDisabled.value,
  },

  {
    key: AppConstTabDeleteType.TAB_ALL,
    label: t('app.tab.ctx.closeAll'),
    icon: () => <WIcon height="24" icon="ant-design:border-outlined"></WIcon>,
    disabled: getCloseOtherDisabled.value,
  },

  {
    key: 'd2',
    type: 'divider',
  },

  {
    key: 'Fix',
    label: currentMouseTab.value?.meta.affix
      ? t('app.base.unfixed')
      : t('app.base.fixed'),
    icon: () => (
      <WIcon
        height="24"
        icon={
          currentMouseTab.value?.meta.affix
            ? 'ant-design:pushpin-filled'
            : 'ant-design:pushpin-outlined'
        }
      >
      </WIcon>
    ),
  },

  {
    key: 'Snapshot',
    label: t('app.tab.ctx.snapshot'),
    icon: () => <WIcon height="24" icon="mdi:fit-to-screen"></WIcon>,
    disabled: getOtherDisabled.value,
  },

  {
    key: 'NewWindow',
    label: t('app.tab.ctx.newWindow'),
    icon: () => <WIcon height="24" icon="mdi:dock-window"></WIcon>,
  },

  {
    key: 'd3',
    type: 'divider',
    show: isDev(),
  },

  {
    key: 'DevTool',
    label: 'DevTool',
    icon: () => <WIcon height="24" icon="mdi:developer-board"></WIcon>,
    show: isDev(),
  },
])
</script>

<template>
  <n-dropdown
    v-if="appSetting.tabs.contextMenu"
    placement="bottom-start"
    trigger="manual"
    size="small"
    :x="x"
    :y="y"
    :options="options"
    :show="ctxMenuShow"
    :on-clickoutside="onCloseCtxMenu"
    @select="onSelect"
  />
</template>
