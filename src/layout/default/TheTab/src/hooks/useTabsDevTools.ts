import { openExternalLink } from '@/utils/window/open'
// @ts-expect-error generated file
import { paths } from '/build/_generated/paths'

export function useTabsDevTools() {
  const devToolShow = ref(false)
  const currentMouseTab = ref<AppTab>()
  const currentMouseTabIndex = ref<number>(0)

  const onOpenDevTool = () => {
    devToolShow.value = true
  }

  const onOpenFile = () => {
    const filePath = currentMouseTab.value?.meta.component
    openExternalLink(`vscode://file/${paths.view}/${filePath}.vue`)
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
