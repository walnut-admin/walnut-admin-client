import type { IResponseData } from '@/api/response'
import { AppAxios } from '@/utils/axios'

export function getCpuInfoAPI() {
  return AppAxios.get<IResponseData.App.Monitor.CPU>({
    url: '/app/monitor/server/cpu',
  })
}

export function getMemInfoAPI() {
  return AppAxios.get<IResponseData.App.Monitor.Mem>({
    url: '/app/monitor/server/mem',
  })
}

export function getOSInfoAPI() {
  return AppAxios.get<IResponseData.App.Monitor.OS>({
    url: '/app/monitor/server/os',
  })
}

export function getSysInfoAPI() {
  return AppAxios.get<IResponseData.App.Monitor.System>(
    {
      url: '/app/monitor/server/sys',
    },
  )
}

export function getDiskInfoAPI() {
  return AppAxios.get<IResponseData.App.Monitor.Disk[]>({
    url: '/app/monitor/server/disk',
  })
}

export function getBatteryInfoAPI() {
  return AppAxios.get<IResponseData.App.Monitor.Battery>({
    url: '/app/monitor/server/battery',
  })
}

export function getTimeInfoAPI() {
  return AppAxios.get<IResponseData.App.Monitor.Time>({
    url: '/app/monitor/server/time',
  })
}

export function getNetworkInfoAPI() {
  return AppAxios.get<IResponseData.App.Monitor.Network>(
    {
      url: '/app/monitor/server/network',
    },
  )
}
