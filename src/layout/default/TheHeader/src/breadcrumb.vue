<script lang="tsx" setup>
import type { TreeNodeItem } from 'easy-fns-ts'
import type { DropdownOption } from 'naive-ui'

import type { IModels } from '@/api/models'

import { findPath } from 'easy-fns-ts'
import { isEmpty } from 'lodash-es'
import { darkTheme } from 'naive-ui'
import { getTheme } from '@/App/src/naive/src/theme'
// TODO 111
import WIcon from '@/components/UI/Icon'

const appStoreMenu = useAppStoreMenu()
const appSetting = useAppStoreSetting()

const { t } = useAppI18n()
const { currentRoute } = useAppRouter()

const [DefineBase, ReuseBase] = createReusableTemplate<{ item: TreeNodeItem<IModels.SystemMenu> }>()

const getChildren = computed((): TreeNodeItem<IModels.SystemMenu>[] | undefined => {
  const matched = findPath<IModels.SystemMenu>(
    appStoreMenu.menus,
    n =>
      n.name
      === (currentRoute.value.meta.menuActiveName
        ? currentRoute.value.meta.menuActiveName
        : currentRoute.value.name),
  )

  // handle menuActiveName
  if (currentRoute.value.meta.menuActiveName) {
    matched?.push({
      name: currentRoute.value.name as string,
      path: currentRoute.value.path,
      meta: {
        ...currentRoute.value.meta,
      },
    })
  }

  return matched?.filter(item => item.title)
})

function getDropdownOptions(arr?: TreeNodeItem<IModels.SystemMenu>[]): DropdownOption[] | undefined {
  if (isEmpty(arr)) {
    return undefined
  }

  return arr?.map(
    i =>
      ({
        key: i.name,
        label: t(i.title as string),
        icon: appSetting.breadcrumb.showIcon
          ? () => <WIcon icon={currentRoute.value.name === i.name ? i.meta?.activeIcon ?? i.icon! : i.icon!} height="20"></WIcon>
          : null,
        children: getDropdownOptions(i.children),
      } as DropdownOption),
  )
}

async function onDropdownSelect(key: string) {
  await useAppRouterPush({ name: key })
}
</script>

<template>
  <DefineBase v-slot="{ item }">
    <div class="flex flex-row flex-nowrap items-center">
      <WIcon v-if="appSetting.breadcrumb.showIcon" :icon="item.meta?.activeIcon ?? item.icon!" height="20" class="mr-1" />

      {{ $t(item.title!) }}
    </div>
  </DefineBase>

  <WTransition appear :transition-name="appSetting.getBreadcrumbTransition">
    <n-config-provider
      :theme="(!isDark && appSetting.header.inverted)
        || isDark
        ? darkTheme
        : null"
    >
      <n-breadcrumb
        v-if="appSetting.getBreadcrumbShow"
        :id="appSetting.getBreadcrumbId" :separator="appSetting.breadcrumb.separator"
      >
        <n-breadcrumb-item v-for="item in getChildren" :key="item._id">
          <n-config-provider
            v-if="appSetting.breadcrumb.showDropdown"
            :theme="getTheme"
          >
            <n-dropdown show-arrow :options="getDropdownOptions(item.children)" @select="onDropdownSelect">
              <ReuseBase :item="item" />
            </n-dropdown>
          </n-config-provider>

          <WTransition v-else appear :transition-name="appSetting.getBreadcrumbTransition" :duration="500">
            <ReuseBase :item="item" />
          </WTransition>
        </n-breadcrumb-item>
      </n-breadcrumb>
    </n-config-provider>
  </WTransition>
</template>
