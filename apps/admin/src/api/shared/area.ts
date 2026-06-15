import type { TreeNodeItem } from 'easy-fns-ts'
import type { IResponseData } from '../response'
import { AppAxios } from '@/utils/axios'

// get area children by pcode, default will return province info
export function getAreaChildrenByPcodeAPI(pcode?: string) {
  return AppAxios.get<IResponseData.Shared.Area[]>(
    {
      url: '/shared/area/children',
      params: {
        pcode,
      },
      _cache: true,
    },
  )
}

// area feedback, single
export function getAreaFeedbackByCodeAPI(codes?: string | string[]) {
  return AppAxios.get<TreeNodeItem<IResponseData.Shared.Area>[]>({
    url: '/shared/area/feedback',
    params: {
      codes,
    },
  })
}
