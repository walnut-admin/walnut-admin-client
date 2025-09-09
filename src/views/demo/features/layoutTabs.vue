<script lang="ts" setup>
import type { Recordable } from 'easy-fns-ts'

defineOptions({
  name: 'FeatureLayoutTabs',
})

const appStoreTab = useAppStoreTab()

const count = ref(0)

const otherName = 'FeatureAnimationName'

const getOtherTabButtonDisabled = computed(
  () => !appStoreTab.tabs.some(i => i.name === otherName),
)

function onCreate(type: number) {
  const query
    = type === 1 ? { testQuery1: 1, testQuery2: 'abc', testQuery3: false } : {}

  const params
    = type === 2 ? { testParam1: 1, testParam2: 'abc', testParam3: false } : {}

  appStoreTab.createTabs({
    name: `name-${count.value}`,
    path: `path-${count.value}`,
    meta: {
      title: `demo-tab-${count.value}`,
      icon: 'ant-design:home-outlined',
    },
    query,
    params,
  })

  count.value++
}

function onDelete() {
  if (!count.value)
    return

  count.value--

  appStoreTab.deleteTabs(`name-${count.value}`)
}

function onDynamicTitle(type: number, self = true) {
  const pool: Recordable = {
    1: () => {
      appStoreTab.setCurrentTabTitle('Title ?')
    },
    2: () => {
      appStoreTab.setCurrentTabTitle('3s expired', {
        timeout: 3000,
        maxLength: 12,
      })
    },
    3: () => {
      appStoreTab.setCurrentTabTitle(
        'this will scrolling for 10s and then recover',
        {
          timeout: 10000,
          maxLength: 12,
        },
      )
    },
    4: () => {
      appStoreTab.recoverCurrentTabTitle()
    },
  }

  const pool2: Recordable = {
    1: () => {
      appStoreTab.setTabTitle(otherName, 'Title ?')
    },
    2: () => {
      appStoreTab.setTabTitle(otherName, '3s expired', {
        timeout: 3000,
        maxLength: 12,
      })
    },
    3: () => {
      appStoreTab.setTabTitle(
        otherName,
        'this will scrolling for 10s and then recover',
        {
          timeout: 10000,
          maxLength: 12,
        },
      )
    },
    4: () => {
      appStoreTab.recoverTabTitle(otherName)
    },
  }

  if (self)
    pool[type]()
  else
    pool2[type]()
}

function onDynamicIcon(type: number, self = true) {
  const pool: Recordable = {
    1: () => {
      appStoreTab.setCurrentTabIcon('ant-design:android-filled')
    },
    2: () => {
      appStoreTab.setCurrentTabIcon('ant-design:android-outlined', {
        timeout: 3000,
      })
    },
    3: () => {
      appStoreTab.setCurrentTabIcon('ant-design:android-filled', {
        animate: true,
        duration: 2000,
      })
    },
    4: () => {
      appStoreTab.recoverCurrentTabIcon()
    },
  }

  const pool2: Recordable = {
    1: () => {
      appStoreTab.setTabIcon(otherName, 'ant-design:android-filled')
    },
    2: () => {
      appStoreTab.setTabIcon(otherName, 'ant-design:android-outlined', {
        timeout: 3000,
      })
    },
    3: () => {
      appStoreTab.setTabIcon(otherName, 'ant-design:android-filled', {
        animate: true,
        duration: 2000,
      })
    },
    4: () => {
      appStoreTab.recoverTabIcon(otherName)
    },
  }

  if (self)
    pool[type]()
  else
    pool2[type]()
}

onMounted(() => {
  const oldCount = appStoreTab.tabs.filter(i => i.name.startsWith('name-')).length
  count.value = oldCount < 0 ? 0 : oldCount
})
</script>

<template>
  <WDemoCard title="Demo for layout tab">
    <n-list>
      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Basic create: {{ count }}
        </WTitle>

        <n-button @click="onCreate(0)">
          Create
        </n-button>
        <n-button @click="onDelete">
          Delete
        </n-button>
        <n-button @click="onCreate(1)">
          Create with query
        </n-button>
        <n-button @click="onCreate(2)">
          Create with params
        </n-button>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Dynamic Title
        </WTitle>

        <n-button @click="onDynamicTitle(1)">
          Set title
        </n-button>
        <n-button @click="onDynamicTitle(2)">
          Set title with timeout limit(3s)
        </n-button>
        <n-button @click="onDynamicTitle(3)">
          Set title with scrolling for 10s
        </n-button>
        <n-button @click="onDynamicTitle(4)">
          Recovery
        </n-button>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Other tab Title (Open the custom animation name page and then come back)
        </WTitle>

        <n-button
          :disabled="getOtherTabButtonDisabled"
          @click="onDynamicTitle(1, false)"
        >
          Set title
        </n-button>
        <n-button
          :disabled="getOtherTabButtonDisabled"
          @click="onDynamicTitle(2, false)"
        >
          Set title with timeout limit(3s)
        </n-button>
        <n-button
          :disabled="getOtherTabButtonDisabled"
          @click="onDynamicTitle(3, false)"
        >
          Set title with scrolling for 10s
        </n-button>
        <n-button
          :disabled="getOtherTabButtonDisabled"
          @click="onDynamicTitle(4, false)"
        >
          Recovery
        </n-button>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Dynamic Icon
        </WTitle>

        <n-button @click="onDynamicIcon(1)">
          Set Icon
        </n-button>
        <n-button @click="onDynamicIcon(2)">
          Set icon with timeout limit(3s)
        </n-button>
        <n-button @click="onDynamicIcon(3)">
          Set icon with animate
        </n-button>
        <n-button @click="onDynamicIcon(4)">
          Recovery
        </n-button>
      </n-list-item>

      <n-list-item>
        <WTitle prefix="bar" class="mb-2">
          Other tab Icon (Open the custom animation name page and then come back)
        </WTitle>

        <n-button
          :disabled="getOtherTabButtonDisabled"
          @click="onDynamicIcon(1, false)"
        >
          Set Icon
        </n-button>
        <n-button
          :disabled="getOtherTabButtonDisabled"
          @click="onDynamicIcon(2, false)"
        >
          Set icon with timeout limit(3s)
        </n-button>
        <n-button
          :disabled="getOtherTabButtonDisabled"
          @click="onDynamicIcon(3, false)"
        >
          Set icon with animate
        </n-button>
        <n-button
          :disabled="getOtherTabButtonDisabled"
          @click="onDynamicIcon(4, false)"
        >
          Recovery
        </n-button>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
