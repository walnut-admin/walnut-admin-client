import type { IModels } from '../models'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const menuAPI = new BaseAPI<IModels.SystemMenu>({
  model: 'system',
  section: 'menu',
})

// get tree data for menu page
export function getMenuTreeAPI() {
  return AppAxios.get<IResponseData.System.Menu.Tree>(
    {
      url: '/system/menu/tree',
    },
  )
}
