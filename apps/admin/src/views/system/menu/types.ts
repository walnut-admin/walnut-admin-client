import type { ConvertNestedProperties, NullableRecord } from 'easy-fns-ts'
import type { IModels } from '@/api/models'

export type IAppSystemMenuForm = NullableRecord<ConvertNestedProperties<IModels.SystemMenu, 'meta'>>
