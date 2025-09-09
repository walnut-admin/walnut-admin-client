<script lang="ts" setup  generic="T">
import type { StringOrNumber } from 'easy-fns-ts'
import type { WTable } from '../../../types'

import { useSortable } from '@vueuse/integrations/useSortable'
import { getThemeOverridesCommon } from '@/App/src/naive/src/theme'
import { useTableContext } from '../../../hooks/useTableContext'
import { getTableTranslated } from '../../../utils'

defineOptions({
  name: 'WTableHeaderRightColumns',
})

const { tableColumns, tablePropsCtx } = useTableContext<T>()
const { getProps: props } = tablePropsCtx

const popoverShow = ref(false)

const tableColumnSettingRef = useTemplateRef<HTMLElement>('tableColumnSettingRef')

const { start, stop } = useSortable(tableColumnSettingRef, tableColumns, {
  animation: 150,
  delay: 50,
  delayOnTouchOnly: true,

  draggable: `.table-column-draggable`,
  onEnd: (evt) => {
    const { oldIndex, newIndex } = evt

    const current = tableColumns.value[oldIndex!]
    tableColumns.value?.splice(oldIndex!, 1)
    tableColumns.value?.splice(newIndex!, 0, current)
  },
})

watch(
  () => popoverShow.value,
  async (v) => {
    await nextTick()

    if (v)
      start()

    else
      stop()
  },
)

const blackList: StringOrNumber[] = ['selection', 'index', 'action']

const isInBlackList = (key: StringOrNumber) => blackList.includes(key)

const getChecked = computed(() =>
  tableColumns.value.every(i => i._internalShow),
)

const getIndeterminate = computed(
  () =>
    tableColumns.value.some(i => !i._internalShow)
    && tableColumns.value.some(i => i._internalShow),
)

// open column setting popover
function onOpenPopover() {
  popoverShow.value = true
}

// check one column
function onUpdateItemChecked(item: WTable.Column<T>) {
  item._internalShow = !item._internalShow
}

// check all
function onUpdateCheckAllChecked() {
  tableColumns.value
    .filter(i => !isInBlackList(i.key))
    .map(item => onUpdateItemChecked(item))
}

// set column fix state
function onSetFix(item: WTable.Column<T>, position: 'left' | 'right') {
  if (!item.fixed)
    item.fixed = position
  else
    item.fixed = undefined
}

function getTitle(item: WTable.Column<T>) {
  return getTableTranslated(props, item)
}
</script>

<template>
  <n-tooltip trigger="hover">
    {{ $t('table.base.settings') }}
    <template #trigger>
      <n-popover v-model:show="popoverShow" placement="bottom" trigger="manual" @clickoutside="popoverShow = false">
        <template #trigger>
          <span>
            <WIconButton :icon-props="{ icon: 'ant-design:setting-outlined' }" :button-props="{ text: true, onClick: onOpenPopover }" />
          </span>
        </template>

        <template #header>
          <n-checkbox :checked="getChecked" :indeterminate="getIndeterminate" @update-checked="onUpdateCheckAllChecked">
            {{ $t('app.base.check') }}
          </n-checkbox>
        </template>

        <template #default>
          <div id="tableSortable" ref="tableColumnSettingRef">
            <div
              v-for="item in tableColumns"
              :key="item.key"
              class="mx-1 my-2 hstack justify-between"
              :class="[
                { 'table-column-draggable': !isInBlackList(item.key) },
              ]"
            >
              <div class="mr-8 hstack items-center">
                <n-tooltip :trigger="isInBlackList(item.key) ? 'manual' : 'hover'" placement="left">
                  <template #trigger>
                    <n-button text :disabled="isInBlackList(item.key)">
                      <WIcon
                        icon="ant-design:drag-outlined"
                        height="20"
                        class="mr-2 cursor-move"
                        :class="[
                          { 'cursor-not-allowed': isInBlackList(item.key) },
                        ]"
                      />
                    </n-button>
                  </template>

                  <span class="p-0">
                    {{ $t('table.base.settings.column.drag') }}
                  </span>
                </n-tooltip>

                <n-checkbox
                  :disabled="isInBlackList(item.key)"
                  :checked="item._internalShow"
                  @update-checked="onUpdateItemChecked(item)"
                >
                  {{ getTitle(item) }}
                </n-checkbox>
              </div>

              <div class="hstack items-center justify-center">
                <n-tooltip trigger="hover" placement="left" style="padding: 0 !important">
                  <template #trigger>
                    <n-button text :disabled="isInBlackList(item.key)">
                      <WIcon
                        icon="mdi:arrow-collapse-left"
                        height="20"
                        class="cursor-pointer"
                        :style="{
                          color:
                            item.fixed === 'left'
                              ? `${getThemeOverridesCommon.infoColor} !important`
                              : 'currentColor',
                        }"
                        @click="!isInBlackList(item.key) && onSetFix(item, 'left')"
                      />
                    </n-button>
                  </template>

                  <span class="p-0">
                    {{ item.fixed === 'left' ? $t('table.base.settings.column.unfix') : $t('table.base.settings.column.fixLeft') }}
                  </span>
                </n-tooltip>

                <n-divider vertical />

                <n-tooltip trigger="hover" placement="left" style="padding: 0 !important">
                  <template #trigger>
                    <n-button text :disabled="isInBlackList(item.key)">
                      <WIcon
                        icon="mdi:arrow-collapse-right"
                        height="20"
                        class="cursor-pointer"
                        :style="{
                          color:
                            item.fixed === 'right'
                              ? `${getThemeOverridesCommon.infoColor} !important`
                              : 'currentColor',
                        }"
                        @click="!isInBlackList(item.key) && onSetFix(item, 'right')"
                      />
                    </n-button>
                  </template>

                  <span class="p-0">
                    {{ item.fixed === 'right' ? $t('table.base.settings.column.unfix') : $t('table.base.settings.column.fixRight') }}
                  </span>
                </n-tooltip>
              </div>
            </div>
          </div>
        </template>
      </n-popover>
    </template>
  </n-tooltip>
</template>

<style lang="scss" scoped>

</style>
