import type { IModels } from '../models'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const dictTypeAPI = new BaseAPI<IModels.SystemDictType>({
  model: 'system',
  section: 'dict/type',
})

export const dictDataAPI = new BaseAPI<IModels.SystemDictType>({
  model: 'system',
  section: 'dict/data',
})

export type IAppDictDataPicked = Pick<
  IModels.SystemDictData,
  'value' | 'label' | 'description' | 'order' | 'tagType'
>

export type IAppStoreMapDictValue = (Pick<IModels.SystemDictType, 'type' | 'name'> & { dictData: IAppDictDataPicked[] })

// default all dict will cacahed for 10 minutes
export function getDictByTypeAPI(types: string | string[]) {
  return AppAxios.get<IAppStoreMapDictValue[]>(
    {
      url: '/system/dict/type/s',
      params: { types },
      _throttle: 500,
      _cache: true,
    },
  )
}
