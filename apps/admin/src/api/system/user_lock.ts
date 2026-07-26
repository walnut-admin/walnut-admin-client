import type { IResponseData } from '../response'
import type { IStoreApp } from '@/store/types'
import { AppAxios } from '@/utils/axios'

// get lock status
export function getLockStatusAPI() {
  return AppAxios.get<IResponseData.System.User.LockStatus>(
    {
      url: '/system/user/lock/read',
    },
  )
}

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
