import type { IStoreApp } from '@/store/types'

export function useTabsDevTools() {
  const devToolShow = ref(false)
  const currentMouseTab = ref<IStoreApp.Tab.Item>()
  const currentMouseTabIndex = ref<number>(0)

  const onOpenDevTool = () => {
    devToolShow.value = true
  }

  const onOpenFile = () => {
    const filePath = currentMouseTab.value?.meta.component
    console.log(`vscode://file/YOUR_PROJECT_PATH}/${filePath}.vue`)
    devToolShow.value = false
  }

  return {
    devToolShow,
    currentMouseTab,
    currentMouseTabIndex,
    onOpenDevTool,
    onOpenFile,
  }
}
