<script lang="ts" setup>
import type { InputInst } from 'naive-ui'
import type { ICompExtraIconPickerProps } from '.'

import { useFormItem } from 'naive-ui/es/_mixins'

import { mockListApi } from '@/utils/shared'
// @ts-expect-error build generated files
import allIcons from '/build/_generated/icon-list.ts'
// @ts-expect-error build generated files
import { IconBundleConfig } from '/build/icon/src/config.ts'

defineOptions({
  name: 'WCompExtraIconPicker',
})

const props = withDefaults(defineProps<ICompExtraIconPickerProps>(), {
  preset: 'input',
})

const formItem = useFormItem(props)
const { nTriggerFormInput, mergedDisabledRef, mergedStatusRef, mergedSizeRef } = formItem

const ALL = 'All'

const value = defineModel<string>('value', { })

const rootInputRef = useTemplateRef<InputInst>('rootInputRef')

const page = ref(1)
const pageSize = ref(50)
const show = ref(false)
const filters = ref('')
const loading = ref(false)
const currentTab = ref(ALL)
const currentIcon = ref<string>()

const getTabLists = computed(() => [ALL, ...IconBundleConfig.list])

const getIconListsWithTab = computed<string[]>(() =>
  (allIcons as string[]).filter(i =>
    currentTab.value === ALL ? true : i.startsWith(currentTab.value),
  ),
)

const getResponse = computed(() => {
  const filtered = getIconListsWithTab.value.filter(i =>
    i.includes(filters.value),
  )

  const mock = mockListApi(filtered)

  const res = mock({
    page: {
      page: page.value,
      pageSize: pageSize.value,
    },
  })

  return res
})

// tab change & search opertaions, need to set page to 1
const getLists = computed(() => getResponse.value.data)
const getTotal = computed(() => getResponse.value.total)

// use watch to fake the loading
watchThrottled(
  () => getLists.value,
  async () => {
    loading.value = true

    await nextTick()

    loading.value = false
  },
  {
    throttle: 750,
    deep: true,
  },
)

// filter input change
// immediate set page to 1
watch(
  () => filters.value,
  () => {
    page.value = 1
  },
  {
    immediate: true,
  },
)

// show change
// set filters to empty string
watch(
  () => show.value,
  () => {
    filters.value = ''
  },
  {
    immediate: true,
  },
)

function onOpenPopover() {
  onFeedback()

  show.value = true
}

function onChooseIcon(icon: string) {
  show.value = false

  value.value = icon

  // fix not trigger rule in form
  nTriggerFormInput()
}

function onClear(e: MouseEvent) {
  e.stopPropagation()
  onPageInit()
  value.value = ''
}

function onMouseEnter(icon: string) {
  currentIcon.value = icon
}

function onMouseLeave() {
  currentIcon.value = value.value!
}

function onPageInit() {
  page.value = 1
}

function onFeedback() {
  if (!value.value)
    return

  // set currentIcon
  currentIcon.value = value.value

  // set currentTab
  currentTab.value = IconBundleConfig.list.find((i: string) =>
    value.value?.startsWith(i),
  )

  // set current page
  const iconIndex = getIconListsWithTab.value.findIndex(
    item => item === value.value,
  )
  page.value = Math.floor(iconIndex / pageSize.value) + 1
}

onBeforeMount(() => {
  onFeedback()
})
</script>

<template>
  <WInput
    v-if="preset === 'input'"
    ref="rootInputRef"
    :value="value"
    :placeholder="$t('comp.iconPicker.title')"
    clearable
    readonly
    copiable
    :status="mergedStatusRef"
    :disabled="mergedDisabledRef"
    :size="mergedSizeRef"
    @click="onOpenPopover"
    @clear="onClear"
  >
    <template #prefix>
      <WIcon
        v-if="value"
        class="mr-2 h-auto cursor-pointer"
        :icon="value"
        width="24"
        @click.prevent.stop
      />
    </template>
  </WInput>

  <WIcon
    v-if="preset === 'icon'"
    class="mr-2 h-auto cursor-pointer"
    :icon="value!"
    width="24"
    @click="onOpenPopover"
  />

  <WModal
    v-model:show="show"
    preset="card"
    width="600px"
    :title="$t('comp.iconPicker.title')"
    display-directive="show"
    :auto-focus="false"
    :default-button="false"
    :segmented="false"
    draggable
  >
    <n-spin :show="loading">
      <div class="relative vstack items-center justify-center">
        <n-input
          v-model:value="filters"
          size="small"
          clearable
          :placeholder="$t('comp.iconPicker.ph')"
          class="mb-3 mt-1 w-full border-b-cool-gray-50"
          @change="onPageInit"
        />

        <n-tabs
          v-model:value="currentTab"
          type="line"
          size="small"
          animated
          @update:value="onPageInit"
        >
          <n-tab-pane v-for="i in getTabLists" :key="i" :name="i" :tab="i" />
        </n-tabs>

        <div
          class="grid grid-cols-12 h-full w-full gap-2"
          @mouseleave="onMouseLeave"
        >
          <div class="col-span-3 flex items-center justify-center">
            <WIcon
              :icon="currentIcon ?? 'ant-design:home-outlined'"
              height="96"
              class="drop-shadow-2xl"
            />
          </div>

          <div class="col-span-9 h-60">
            <div class="grid grid-cols-10 mt-4 gap-1">
              <div v-for="icon in getLists" :key="icon" :title="icon">
                <WIcon
                  :icon="icon"
                  width="32"
                  class="inline border-2 border-gray-700 rounded border-solid hover:cursor-pointer" :class="[
                    {
                      'bg-light-blue-300': icon === value,
                      'hover:bg-warm-gray-300': icon !== value,
                    },
                  ]"
                  @click="onChooseIcon(icon)"
                  @mouseenter="onMouseEnter(icon)"
                />
              </div>
            </div>

            <div class="h-full flex items-center justify-center">
              <n-empty v-show="getLists.length === 0" />
            </div>
          </div>
        </div>

        <n-pagination
          v-model:page="page"
          :page-size="pageSize"
          :item-count="getTotal"
          size="small"
          class="text-sm"
          :page-slot="9"
        >
          <template #suffix>
            <span class="whitespace-nowrap">
              {{ $t('comp.pagination.total', { total: getTotal }) }}
            </span>
          </template>
        </n-pagination>
      </div>
    </n-spin>
  </WModal>
</template>
