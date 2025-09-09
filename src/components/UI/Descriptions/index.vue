<script lang="tsx" setup  generic="T">
import type { BaseDataType } from 'easy-fns-ts'
import type { ICompUIDescriptionProps, ICompUIDescriptionsItem, ICompUIDescTypeDict, ICompUIDescTypeLink } from '.'
import { omit } from 'lodash-es'
import { getBoolean } from '@/utils/shared'
import { openExternalLink } from '@/utils/window/open'

defineOptions({
  name: 'WCompUIDescriptions',
})

const { items, colon = false } = defineProps<ICompUIDescriptionProps>()

const { t } = useAppI18n()

const getData = computed(() => Object.fromEntries<BaseDataType>(items.map<[string, BaseDataType]>(i => [i.key!, i.value])))

const getShowItem = computed<ICompUIDescriptionsItem[]>(() => items.filter(i => getBoolean(i.show)))

function onClickText(item: ICompUIDescriptionsItem) {
  const LinkItem = item as ICompUIDescTypeLink<T>
  const link = LinkItem.typeProps?.link
  const clickEvent = LinkItem.typeProps?.onLinkClick

  if (link) {
    openExternalLink(link)
  }

  if (clickEvent) {
    clickEvent(item.value, getData.value as T)
  }
}

function onFormat(item: ICompUIDescriptionsItem) {
  return (typeof item.formatter === 'function'
    ? item.formatter(item.value, getData.value)
    : item.value) || t('app.base.none')
}

const showDict = ref(false)
onBeforeMount(async () => {
  if (items.some(i => i.type === 'dict')) {
    const usedDictTypes = items.filter(i => i.type === 'dict').map(i => (i as ICompUIDescTypeDict<T>).typeProps?.dictType as string)
    console.log('WDesc Dict Init', { usedDictTypes })
    await initDict(usedDictTypes)
    showDict.value = true
  }
})
</script>

<template>
  <n-descriptions>
    <n-descriptions-item v-for="(item, index) in getShowItem" :key="index" v-bind="omit(item, 'label')">
      <template #label>
        <span :style="item.labelStyle" class="whitespace-nowrap" :class="[item.labelClass]">{{ colon ? `${item.label}：` : item.label }}</span>
      </template>

      <template #default>
        <div :class="item.contentClass" :style="item.contentStyle">
          <n-tag
            v-if="item.type === 'tag'"
            v-bind="item.typeProps"
          >
            {{ onFormat(item) }}
          </n-tag>

          <n-text
            v-else-if="item.type === 'link'"
            v-bind="item.typeProps"
            class="cursor-pointer"
            @click="onClickText(item)"
          >
            {{ onFormat(item) }}
          </n-text>

          <WJSON
            v-else-if="item.type === 'json'"
            v-bind="item.typeProps"
            :value="item.value"
          />

          <WDictLabel
            v-else-if="showDict && item.type === 'dict'"
            :dict-type="(item.typeProps?.dictType as string)"
            :dict-value="item.value"
          />

          <div v-else class="whitespace-pre-wrap break-all">
            {{ onFormat(item) }}
          </div>
        </div>
      </template>
    </n-descriptions-item>
  </n-descriptions>
</template>
