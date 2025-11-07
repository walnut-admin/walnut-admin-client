import type { IResponseData } from '../response'
import type { IStoreApp } from '@/store/types'
import { AppAxios } from '@/utils/axios'

// lock
export function lockAPI(lockRoute: IStoreApp.LockRoute) {
  return AppAxios.patch<IResponseData.System.User.Lock>(
    {
      url: '/system/user/lock',
      data: { lockRoute },
    },
  )
}

// unlock
export function unlockAPI() {
  return AppAxios.patch<IResponseData.System.User.Unlock>(
    {
      url: '/system/user/lock/unlock',
    },
  )
}
