import type { TreeNodeItem } from 'easy-fns-ts'
import type { IModels } from '../models'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const menuAPI = new BaseAPI<IModels.SystemMenu>({
  model: 'system',
  section: 'menu',
})

// get tree data for menu page
export function getMenuTreeAPI() {
  return AppAxios.get<{ fullTree: TreeNodeItem<IModels.SystemMenu>[], treeWithoutTypeElement: TreeNodeItem<IModels.SystemMenu>[], menuActiveNamesOptions: Pick<IModels.SystemMenu, 'title' | 'name'>[] }>(
    {
      url: '/system/menu/tree',
    },
  )
}
