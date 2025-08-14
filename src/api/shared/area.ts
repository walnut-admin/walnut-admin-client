import type { TreeNodeItem } from 'easy-fns-ts'
import { AppAxios } from '@/utils/axios'

// get area children by pcode, default will return province info
export function getAreaChildrenByPcodeAPI(pcode?: string) {
  return AppAxios.get<AppSharedArea[]>(
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
  return AppAxios.get<TreeNodeItem<AppSharedArea>[]>({
    url: '/shared/area/feedback',
    params: {
      codes,
    },
  })
}
