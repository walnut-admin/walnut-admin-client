import type { IModels } from '../models'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const logOperateAPI = new BaseAPI<IModels.SystemLogOperate>({
  model: 'system',
  section: 'log/operate',
})

export function getLogOperateSnapshotAPI(id: string) {
  return AppAxios.get<IResponseData.System.LogOperate.Snapshot>(
    {
      url: `/system/log/operate/${id}/snapshot`,
    },
  )
}

export function getLogOperateDeviceAPI(id: string) {
  return AppAxios.get<IResponseData.System.LogOperate.Device>(
    {
      url: `/system/log/operate/${id}/device`,
    },
  )
}

export const logAuthAPI = new BaseAPI<IModels.SystemLogAuth>({
  model: 'system',
  section: 'log/auth',
})
