<script lang="ts" setup>
import type { TreeNodeItem } from 'easy-fns-ts'
import type { IModels } from '@/api/models'
import type { ICompExtraScrollbarInst } from '@/components/Extra/Scrollbar'
import Fuse from 'fuse.js'
import { cloneDeep } from 'lodash-es'
import { getTheme } from '@/App/src/naive/src/theme'

defineOptions({
  name: 'AppSearch',
  inheritAttrs: false,
})

const { t } = useAppI18n()

const modalShow = ref(false)
const searchQuery = ref('')
const activeIndex = ref(0)

const scrollbarRef = useTemplateRef<ICompExtraScrollbarInst>('scrollbarRef')

const appStoreMenu = useAppStoreMenu()

function treeToArrWithDesc(
  tree: TreeNodeItem<IModels.SystemMenu>[],
  result: any[] = [],
  parents: string[] = [],
) {
  for (const node of tree) {
    const currentTitle = t(node.title!)

    const item = {
      ...node,
      title: currentTitle,
      desc: parents.length ? [...parents, currentTitle].join(' / ') : '',
    }

    result.push(item)

    if (node.children?.length) {
      treeToArrWithDesc(node.children, result, [...parents, currentTitle])
    }
  }
  return result
}

const getTransformedFuseMenus = computed(() => {
  return treeToArrWithDesc(cloneDeep(appStoreMenu.getMenus))
    .filter(i => i.type === AppConstMenuType.MENU && !i.path?.includes(':'))
})

const getFuse = computed(() => {
  return new Fuse(getTransformedFuseMenus.value, {
    keys: ['title', 'name', 'path', 'desc'],
    threshold: 0.3,
  })
})

const getFilteredResults = computed(() => {
  if (!searchQuery.value.trim())
    return []
  return getFuse.value
    .search(searchQuery.value)
    .map(r => r.item)
})

async function onSelect(item: IModels.SystemMenu) {
  modalShow.value = false
  searchQuery.value = ''
  await useAppRouterPush({ name: item.name })
}

function onOpenSearch() {
  modalShow.value = true
}

function onInputChange() {
  activeIndex.value = 0
}

useEventListener('keydown', useDebounceFn((e) => {
  if (!modalShow.value || getFilteredResults.value.length === 0)
    return

  e.preventDefault()
  const total = getFilteredResults.value.length

  if (e.key === 'ArrowDown') {
    activeIndex.value
      = (activeIndex.value + 1) % total

    scrollbarRef.value?.scrollToIndex(activeIndex.value)
  }
  else if (e.key === 'ArrowUp') {
    activeIndex.value
      = (activeIndex.value - 1 + total)
        % total
    scrollbarRef.value?.scrollToIndex(activeIndex.value)
  }
  else if (e.key === 'Enter') {
    const selected = getFilteredResults.value[activeIndex.value]
    if (selected)
      onSelect(selected)
  }
}, 100))
</script>

<template>
  <WIcon icon="mdi:feature-search-outline" height="28" @click="onOpenSearch" />

  <n-modal
    v-model:show="modalShow"
    preset="card"
    :show-icon="false"
    transform-origin="center"
    :auto-focus="false"
    :segmented=" {
      content: 'soft',
      footer: 'soft',
    }"
    :closable="false"
    class="w-2/5 -top-[20vh]"
  >
    <template #header>
      <n-input
        v-model:value="searchQuery"
        :placeholder="$t('app.base.search')"
        size="large"
        autofocus
        clearable
        @change="onInputChange"
      >
        <template #prefix>
          <WIcon icon="ant-design:search-outlined" />
        </template>
      </n-input>
    </template>

    <template #default>
      <div v-if="getFilteredResults.length > 0">
        <n-card :bordered="false">
          <n-list hoverable clickable>
            <WScrollbar ref="scrollbarRef" height="30vh">
              <n-list-item
                v-for="(item, idx) in getFilteredResults"
                :key="item._id"
                class="group cursor-pointer rounded-lg px-2 py-1"
                :style="{
                  background: idx === activeIndex ? getTheme.common.primaryColor : '',
                }"
                @click="onSelect(item)"
              >
                <div class="flex flex-row flex-nowrap items-center justify-start gap-x-4">
                  <WIcon :icon="item.icon" class="transition-transform duration-200 group-hover:scale-115" />

                  <div class="flex flex-col flex-wrap">
                    <n-highlight
                      :text="item.title"
                      :patterns="[searchQuery]"
                    />
                    <n-highlight
                      v-if="item.desc"
                      :text="item.desc"
                      class="mt-1 truncate text-xs text-gray-500"
                      :patterns="[searchQuery]"
                    />
                  </div>
                </div>
              </n-list-item>
            </WScrollbar>
          </n-list>
        </n-card>
      </div>

      <div v-if="!searchQuery" class="h-[30vh] flex flex-col flex-wrap items-center justify-center gap-y-4">
        <WIcon icon="emojione-v1:face-savoring-food" height="64" />
        <div>{{ $t('app.search.start') }}</div>
      </div>

      <n-empty
        v-else-if="getFilteredResults.length === 0 && searchQuery"
        class="h-[30vh] flex items-center justify-center"
      />
    </template>

    <template #footer>
      <div class="flex flex-row flex-nowrap items-center justify-start gap-x-8 text-sm text-gray-500 children:(flex flex-row flex-nowrap items-center gap-x-1)">
        <div>
          <WIcon icon="ant-design:enter-outlined" height="14" />
          <span>{{ $t('app.base.enter') }}</span>
        </div>

        <div>
          <WIcon icon="ant-design:arrow-up-outlined" height="14" />
          <WIcon icon="ant-design:arrow-down-outlined" height="14" />
          <span>{{ $t('app.base.switch') }}</span>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="scss" scoped>
:deep(.w-card > .w-card__content){
  padding: 0 !important;
}
</style>
