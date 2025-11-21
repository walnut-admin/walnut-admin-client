import type { IModels } from '../models'
import { AppAxios } from '@/utils/axios'
import { BaseAPI } from '../base'

export const appLoggerAPI = new BaseAPI<IModels.AppLogger>({
  model: 'app',
  section: 'logger',
})

export function readAppLoggerMoreAPI(id: string, page: number) {
  return AppAxios.get<IModels.AppLogger>({
    url: `/app/logger/${id}?page=${page}`,
  })
}
