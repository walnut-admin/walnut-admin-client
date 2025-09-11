import type { StringOrNumber } from 'easy-fns-ts'
import type { IModels } from './models'
import type { IAxios } from '@/utils/axios/types'
import { omit } from 'lodash-es'
import { AppAxios } from '@/utils/axios'

export type BaseAPIType<T extends IModels.Base> = InstanceType<typeof BaseAPI<T>>

function omitUnnecessaryFields<T extends IModels.Base>(data: T) {
  return omit(data, ['_id', 'createdAt', 'updatedAt'])
}

export class BaseAPI<T extends IModels.Base> {
  private readonly baseAPI: string

  constructor({ model, section }: { model: string, section: string }) {
    this.baseAPI = `/${model}/${section}`
  }

  list(data?: IAxios.BaseListParams<T>) {
    return AppAxios.post<IAxios.BaseListResponse<T>>({
      url: `${this.baseAPI}/list`,
      data,
    })
  }

  create(data: T) {
    return AppAxios.post(
      {
        url: `${this.baseAPI}`,
        data: omitUnnecessaryFields<T>(data),
      },
    )
  }

  read(id: StringOrNumber) {
    return AppAxios.get<T>({
      url: `${this.baseAPI}/${id}`,
    })
  }

  // fix src/components/Advanced/CRUD/index.vue onYes
  detail() {}

  update(data: T) {
    return AppAxios.put<T>(
      {
        url: `${this.baseAPI}/${data._id}`,
        data: omitUnnecessaryFields<T>(data),
      },
    )
  }

  delete(id: StringOrNumber) {
    return AppAxios.delete<T>(
      {
        url: `${this.baseAPI}/${id}`,
      },
    )
  }

  deleteMany(id: string) {
    return AppAxios.delete<T[]>(
      {
        url: `${this.baseAPI}/deleteMany/${id}`,
      },
    )
  }

  clear() {
    return AppAxios.delete<T>(
      {
        url: `${this.baseAPI}/clear`,
      },
    )
  }
}
