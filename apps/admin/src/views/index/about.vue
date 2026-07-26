<script lang="ts" setup>
import type { ICompUIDescriptionsItem } from '@/components/UI/Descriptions'
import { dependencies, devDependencies, homepage, urls, version } from '~build/package'
import now from '~build/time'
import { BackendDepsAPI } from '@/api'

defineOptions({
  name: 'About',
})

const { t } = useAppI18n()
const appStoreAdapter = useAppStoreAdapter()

const infoItems = computed<ICompUIDescriptionsItem[]>(
  () =>
    [
      {
        label: t('desc.about.info.version'),
        value: version,
        type: 'tag',
        typeProps: {
          type: 'primary',
        },
      },
      {
        label: t('desc.about.info.doc'),
        value: t('desc.about.info.doc'),
        type: 'link',
        typeProps: {
          type: 'primary',
          link: urls.doc,
        },
      },
      {
        label: t('desc.about.info.preview'),
        value: t('desc.about.info.preview'),
        type: 'link',
        typeProps: {
          type: 'primary',
          link: urls.demo,
        },
      },
      {
        label: t('desc.about.info.code'),
        value: t('desc.about.info.code'),
        type: 'link',
        typeProps: {
          type: 'primary',
          link: homepage,
        },
      },
      {
        label: t('desc.about.info.buildTime'),
        value: `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
        type: 'tag',
        typeProps: {
          type: 'info',
        },
      },
    ],
)

const frontendDeps = ref<ICompUIDescriptionsItem[]>(
  Object.entries(dependencies).map(([k, v]) => ({
    label: k,
    value: v,
    type: 'link',
    typeProps: { type: 'info', link: `https://www.npmjs.com/package/${k}` },
  })),
)
const frontendDevDeps = ref<ICompUIDescriptionsItem[]>(
  Object.entries(devDependencies).map(([k, v]) => ({
    label: k,
    value: v,
    type: 'link',
    typeProps: { type: 'info', link: `https://www.npmjs.com/package/${k}` },
  })),
)
const backendDeps = ref()
const backendDevDeps = ref()

async function onGetBackendDeps() {
  const res = await BackendDepsAPI()

  backendDeps.value = Object.entries(res.dependencies).map(([k, v]) => ({
    label: k,
    value: v,
    type: 'link',
    typeProps: { type: 'info', link: `https://www.npmjs.com/package/${k}` },
  }))

  backendDevDeps.value = Object.entries(res.devDependencies).map(([k, v]) => ({
    label: k,
    value: v,
    type: 'link',
    typeProps: { type: 'info', link: `https://www.npmjs.com/package/${k}` },
  }))
}

onBeforeMount(onGetBackendDeps)
</script>

<template>
  <div class="space-y-2">
    <WCard
      :title="t('about.title.info')"
      size="small"
      :segmented="{
        content: true,
        footer: 'soft',
      }"
      header-preset="collapse"
    >
      <WDescriptions
        size="small"
        label-placement="left"
        bordered
        :column="appStoreAdapter.isMobile ? 1 : 2"
        :items="infoItems"
        :label-style="{ width: '30%' }"
        :content-style="{ width: '20%' }"
      />
    </WCard>

    <n-tabs type="segment" animated>
      <n-tab-pane name="front" tab="Frontend" display-directive="show:lazy">
        <WCard
          :title="`${t('about.title.deps')}(${Object.keys(frontendDeps).length})`"
          size="small"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
          header-preset="collapse"
        >
          <WDescriptions
            size="small"
            label-placement="left"
            bordered
            :column="appStoreAdapter.isMobile ? 1 : 2"
            :items="frontendDeps"
            :label-style="{ width: '30%' }"
            :content-style="{ width: '20%' }"
          />
        </WCard>

        <WCard
          :title="`${t('about.title.devdeps')}(${Object.keys(frontendDevDeps).length})`"
          size="small"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
          header-preset="collapse"
        >
          <WDescriptions
            size="small"
            label-placement="left"
            bordered
            :column="appStoreAdapter.isMobile ? 1 : 2"
            :items="frontendDevDeps"
            :label-style="{ width: '30%' }"
            :content-style="{ width: '20%' }"
          />
        </WCard>
      </n-tab-pane>

      <n-tab-pane name="back" tab="Backend" display-directive="show:lazy">
        <WCard
          :title="`${t('about.title.deps')}(${Object.keys(backendDeps).length})`"
          size="small"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
          header-preset="collapse"
        >
          <WDescriptions
            size="small"
            label-placement="left"
            bordered
            :column="appStoreAdapter.isMobile ? 1 : 2"
            :items="backendDeps"
            :label-style="{ width: '30%' }"
            :content-style="{ width: '20%' }"
          />
        </WCard>

        <WCard
          :title="`${t('about.title.devdeps')}(${Object.keys(backendDevDeps).length})`"
          size="small"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
          header-preset="collapse"
        >
          <WDescriptions
            size="small"
            label-placement="left"
            bordered
            :column="appStoreAdapter.isMobile ? 1 : 2"
            :items="backendDevDeps"
            :label-style="{ width: '30%' }"
            :content-style="{ width: '20%' }"
          />
        </WCard>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
