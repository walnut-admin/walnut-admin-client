<script lang="tsx" setup>
import WTransition from '@/components/Extra/Transition'
import WIFrame from './index.vue'

defineOptions({
  name: 'TheIFrameWrapper',
})

const [DefineIframe, ReuseIframe] = createReusableTemplate<{ item: IAppTabIframe }>()

const appSetting = useAppStoreSetting()
const appStoreTab = useAppStoreTab()

const getIframeList = computed(() =>
  appStoreTab.iframeList.filter(e =>
    appStoreTab.tabs.some(tab => tab.name === e.name),
  ),
)

const TransitionWrapper = defineComponent({
  props: {
    item: { type: Object as PropType<IAppTabIframe>, required: true },
  },
  setup(props) {
    return () => appSetting.getTransition
      ? (
          <WTransition
            transition-name={appSetting.getTransition}
            mode="out-in"
            appear
          >
            <ReuseIframe item={props.item} />
          </WTransition>
        )
      : <ReuseIframe item={props.item} />
  },
})
</script>

<template>
  <DefineIframe v-slot="{ item: i }">
    <WIFrame
      v-show="i.cache ? i.name === $route.name : true"
      v-if="!i.cache ? i.name === $route.name : true"
      :key="i.cache ? `cache_${i.name}` : i.name"
      :frame-src="i.url"
    />
  </DefineIframe>

  <template v-for="iframeItem in getIframeList" :key="iframeItem.name">
    <TransitionWrapper :item="iframeItem" />
  </template>
</template>
