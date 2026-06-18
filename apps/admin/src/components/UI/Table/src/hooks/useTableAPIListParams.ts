import type { BaseListParams, BaseListResponse, BasePageParams, BaseResponse, BaseSortParams } from '@walnut/axios/types'
import { useState } from '@walnut/core/hooks/core/useState'

export function useTableAPIListParams<T>() {
  const {
    stateRef: apiListParams,
    resetState: resetParams,
    commit: commitParams,
  } = useState<BaseListParams<T>>({
    query: {} as T,
    sort: [],
    page: {
      page: 1,
      pageSize: 10,
    },
  })

  return { apiListParams, resetParams, commitParams }
}

export type ICompUITableHooksAPIListParams<T> = ReturnType<typeof useTableAPIListParams<T>>
