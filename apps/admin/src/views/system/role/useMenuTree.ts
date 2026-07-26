import type { TreeNodeItem } from 'easy-fns-ts'
import type { IModels } from '@/api/models'
import { formatTree } from 'easy-fns-ts'
import { getMenuTreeAPI } from '@/api/system/menu'

export function useMenuTree() {
  const { t } = useAppI18n()

  const menuDataRef = ref<TreeNodeItem<IModels.SystemMenu>[]>([])
  const treeSelectDataRef = ref<TreeNodeItem<IModels.SystemMenu>[]>([])
  const menuActiveNamesOptions = ref<Pick<IModels.SystemMenu, 'title' | 'name'>[]>([])

  const getLeftMenu = computed((): TreeNodeItem<IModels.SystemMenu>[] => {
    return formatTree<IModels.SystemMenu>(menuDataRef.value, node => ({
      ...node,
      title: node.title ? t(node.title) : node.title,
    }))
  })

  const getTreeSelect = computed((): TreeNodeItem<IModels.SystemMenu>[] => {
    return formatTree<IModels.SystemMenu>(treeSelectDataRef.value, node => ({
      ...node,
      title: node.title ? t(node.title) : node.title,
    }))
  })

  const onInit = async () => {
    menuDataRef.value.length = 0
    treeSelectDataRef.value.length = 0
    menuActiveNamesOptions.value.length = 0

    const res = await getMenuTreeAPI()

    menuDataRef.value = res.fullTree
    treeSelectDataRef.value = res.treeWithoutTypeElement
    menuActiveNamesOptions.value = res.menuActiveNamesOptions
  }

  onMounted(onInit)

  return { getLeftMenu, getTreeSelect, menuActiveNamesOptions, onInit }
}
