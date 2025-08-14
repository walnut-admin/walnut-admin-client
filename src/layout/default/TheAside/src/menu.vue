<script lang="tsx" setup>
import type { MenuOption } from 'naive-ui'

// TODO 111
import WIcon from '@/components/UI/Icon'
import { openExternalLink } from '@/utils/window/open'

import { findPath, formatTree } from 'easy-fns-ts'
import { omit } from 'lodash-es'

interface MenuMeta {
  type: ValueOfAppConstMenuType
  ternal: ValueOfAppConstMenuTernal
  url: string
}

const appMenu = useAppStoreMenu()
const appTab = useAppStoreTab()
const appAdapter = useAppStoreAdapter()
const appSetting = useAppStoreSetting()

const { t } = useAppI18n()
const { currentRoute } = useAppRouter()

const expandedKeys = ref<string[]>()

const getCurrentMenuName = computed((): string =>
  currentRoute.value.meta?.menuActiveName ?? currentRoute.value.name as string,
)

// format to naive-ui menu option data structure
const getMenuOptions = computed(() =>
  formatTree<AppSystemMenu, MenuOption>(toRaw(appMenu.menus), node => ({
    key: node.name,
    label: t(node.title!),
    icon: () => {
      if (
        (node.type === AppConstMenuType.CATALOG
          && expandedKeys.value?.includes(node.name!))
        || node.name === getCurrentMenuName.value
      ) {
        return (
          <WIcon
            icon={node.meta?.activeIcon ?? node.icon!}
          >
          </WIcon>
        )
      }

      return <WIcon icon={node.icon!}></WIcon>
    },
    meta: {
      type: node.type,
      ternal: node.meta?.ternal,
      url: node.meta?.url,
    } as MenuMeta,
    show: node.meta?.show,
    extra: () =>
      node.meta?.badge && <n-badge size="small" value={node.meta?.badge}></n-badge>,
  })),
)

// handle expanded-keys logic
watch(
  () => getCurrentMenuName.value,
  async (v, oldV) => {
    const paths = findPath<AppSystemMenu>(
      appMenu.menus,
      n => n.name === v,
    )

    if (!paths)
      return

    if (appSetting.menu.accordion) {
      expandedKeys.value = (paths as AppSystemMenu[]).map(i => i.name!)
    }
    else {
      const oldPaths = findPath<AppSystemMenu>(
        appMenu.menus,
        n => n.name === oldV,
      )

      if (!oldPaths)
        return

      expandedKeys.value = [...(oldPaths as AppSystemMenu[]).map(i => i.name!), ...(paths as AppSystemMenu[]).map(i => i.name!)]
    }

    await nextTick()
    const target = document.getElementById(`${currentRoute.value.name as string}-menu-item`)
    target?.scrollIntoView({ behavior: 'smooth' })
  },
)

async function onUpdateValue(key: string, item: MenuOption & { meta?: MenuMeta }) {
  // If isMobile and showAside true, set showAside to false to close drawer
  if (appAdapter.isMobile && appMenu.showAside)
    appMenu.showAside = false

  // normal won't trigger the if below if the routers are configed correctly
  // only trigger when one catelog menu has no children menus
  if (item.meta?.type === AppConstMenuType.CATALOG) {
    useAppMessage().info('Catalog Menu has no page!')
    return
  }

  // open external link, safely
  if (item.meta?.ternal === AppConstMenuTernal.EXTERNAL) {
    openExternalLink(item.meta?.url, true)
    return
  }

  // omit the query field when click the side menu
  // should do so, otherwise once the route has query, user cannot get rid of it
  const targetTab = appTab.tabs.find(i => i.name === key)
  if (targetTab)
    appTab.setTabByName(key, omit(targetTab, 'query'), 'splice')

  await useAppRouterPush({ name: key })
}

function onNodeProps(option: MenuOption) {
  return {
    id: `${option.key}-menu-item`,
  }
}
</script>

<template>
  <WTransition ap-ppear :transition-name="appSetting.getMenuTransition">
    <WScrollbar
      v-if="appSetting.getMenuShow"
      height="100%"
      class="transition-all"
      :class="[{
        'pb-8': appSetting.getMenuCollapseButtonStatus,
        'absolute': appSetting.getLogoFixed,
      }]"
      :style="{
        paddingTop:
          `${appSetting.getLogoShow && appSetting.getLogoFixed
            ? appSetting.header.height
            : 0}px`,
      }"
    >
      <n-menu
        :id="appSetting.getMenuId"
        v-model:expanded-keys="expandedKeys"
        :inverted="appSetting.getMenuInverted"
        :collapsed-width="appSetting.menu.collapsedWidth"
        :accordion="appSetting.menu.accordion"
        :collapsed-icon-size="appSetting.menu.collapsedIconSize"
        :icon-size="appSetting.menu.iconSize"
        :indent="appSetting.menu.indent"
        :options="getMenuOptions"
        :collapsed="appMenu.collapse"
        :value="getCurrentMenuName"
        :node-props="onNodeProps"
        @update:value="onUpdateValue"
      />
    </WScrollbar>
  </WTransition>
</template>
