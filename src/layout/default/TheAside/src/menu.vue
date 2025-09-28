<script lang="tsx" setup>
import type { MenuOption } from 'naive-ui'

import type { IModels } from '@/api/models'
import { findPath, formatTree } from 'easy-fns-ts'

import { omit } from 'lodash-es'
// TODO 111
import WIcon from '@/components/UI/Icon'
import { openExternalLink } from '@/utils/window/open'

interface MenuMeta {
  type: ValueOfAppConstMenuType
  ternal: ValueOfAppConstMenuTernal
  url: string
}

const appStoreMenu = useAppStoreMenu()
const appStoreTab = useAppStoreTab()
const appStoreAdapter = useAppStoreAdapter()
const appStoreSettingDev = useAppStoreSettingDev()
const userStorePreference = useAppStoreUserPreference()

const { t } = useAppI18n()
const { currentRoute } = useAppRouter()

const expandedKeys = ref<string[]>()

const getCurrentMenuName = computed((): string =>
  currentRoute.value.meta?.menuActiveName ?? currentRoute.value.name as string,
)

// format to naive-ui menu option data structure
const getMenuOptions = computed(() =>
  formatTree<IModels.SystemMenu, MenuOption>(toRaw(appStoreMenu.menus), node => ({
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
    const paths = findPath<IModels.SystemMenu>(
      appStoreMenu.menus,
      n => n.name === v,
    )

    if (!paths)
      return

    if (appStoreSettingDev.getMenuAccordion) {
      expandedKeys.value = (paths as IModels.SystemMenu[]).map(i => i.name!)
    }
    else {
      const oldPaths = findPath<IModels.SystemMenu>(
        appStoreMenu.menus,
        n => n.name === oldV,
      )

      if (!oldPaths)
        return

      expandedKeys.value = [...(oldPaths as IModels.SystemMenu[]).map(i => i.name!), ...(paths as IModels.SystemMenu[]).map(i => i.name!)]
    }

    await nextTick()
    const target = document.getElementById(`${currentRoute.value.name as string}-menu-item`)
    target?.scrollIntoView({ behavior: 'smooth' })
  },
)

async function onUpdateValue(key: string, item: MenuOption & { meta?: MenuMeta }) {
  // If isMobile and showAside true, set showAside to false to close drawer
  if (appStoreAdapter.isMobile && appStoreMenu.getShowAside)
    appStoreMenu.setShowAside(false)

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
  const targetTab = appStoreTab.tabs.find(i => i.name === key)
  if (targetTab)
    appStoreTab.setTabByName(key, omit(targetTab, 'query'))

  await useAppRouterPush({ name: key })
}

function onNodeProps(option: MenuOption) {
  return {
    id: `${option.key}-menu-item`,
  }
}
</script>

<template>
  <WTransition ap-ppear :transition-name="appStoreSettingDev.getMenuTransition">
    <WScrollbar
      v-if="appStoreSettingDev.getMenuShow"
      height="100%"
      class="transition-all"
      :class="[{
        'pb-8': appStoreSettingDev.getMenuCollapseButtonStatus,
        'absolute': appStoreSettingDev.getLogoFixed,
      }]"
      :style="{
        paddingTop:
          `${appStoreSettingDev.getLogoShow && appStoreSettingDev.getLogoFixed
            ? appStoreSettingDev.header.height
            : 0}px`,
      }"
    >
      <n-menu
        :id="appStoreSettingDev.getMenuId"
        v-model:expanded-keys="expandedKeys"
        :inverted="userStorePreference.getMenuInverted"
        :collapsed-width="appStoreSettingDev.getMenuCollapsedWidth"
        :accordion="appStoreSettingDev.getMenuAccordion"
        :collapsed-icon-size="appStoreSettingDev.getMenuCollapsedIconSize"
        :icon-size="appStoreSettingDev.getMenuIconSize"
        :indent="appStoreSettingDev.getMenuIndent"
        :options="getMenuOptions"
        :collapsed="appStoreMenu.getCollapse"
        :value="getCurrentMenuName"
        :node-props="onNodeProps"
        @update:value="onUpdateValue"
      />
    </WScrollbar>
  </WTransition>
</template>
