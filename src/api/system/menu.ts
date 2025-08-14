import type { TreeNodeItem } from 'easy-fns-ts'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const menuAPI = new BaseAPI<AppSystemMenu>({
  model: 'system',
  section: 'menu',
})

// get tree data for menu page
export function getMenuTreeAPI() {
  return AppAxios.get<{ fullTree: TreeNodeItem<AppSystemMenu>[], treeWithoutTypeElement: TreeNodeItem<AppSystemMenu>[], menuActiveNamesOptions: Pick<AppSystemMenu, 'title' | 'name'>[] }>(
    {
      url: '/system/menu/tree',
    },
  )
}
