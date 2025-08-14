import { AppAxios } from '@/utils/axios'

export namespace IServerInfo {
  export interface CPU {
    cores: number
    brand: string
    speed: number
    manufacturer: string
  }

  export interface Mem {
    total: number
    free: number
    used: number
    avaiable: number
  }

  export interface OS {
    hostname: string
    arch: string
    platform: string
    distro: string
  }

  export interface System {
    manufacturer: string
    model: string
    version: string
    uuid: string
  }

  export interface Disk {
    name: string
    size: number
    device: string
    type: string
  }

  export interface Battery {
    voltage: number
    designedCapacity: number
    currentCapacity: number
    percent: number
  }

  export interface Time {
    current: number
    uptime: number
    timezone: string
    timezoneName: string
  }

  export interface Network {
    iface: string
    ip4: string
    mac: string
    netSpeed: string
  }
}

export function getCpuInfoAPI() {
  return AppAxios.get<IServerInfo.CPU>({
    url: '/app/monitor/server/cpu',
  })
}

export function getMemInfoAPI() {
  return AppAxios.get<IServerInfo.Mem>({
    url: '/app/monitor/server/mem',
  })
}

export function getOSInfoAPI() {
  return AppAxios.get<IServerInfo.OS>({
    url: '/app/monitor/server/os',
  })
}

export function getSysInfoAPI() {
  return AppAxios.get<IServerInfo.System>(
    {
      url: '/app/monitor/server/sys',
    },
  )
}

export function getDiskInfoAPI() {
  return AppAxios.get<IServerInfo.Disk[]>({
    url: '/app/monitor/server/disk',
  })
}

export function getBatteryInfoAPI() {
  return AppAxios.get<IServerInfo.Battery>({
    url: '/app/monitor/server/battery',
  })
}

export function getTimeInfoAPI() {
  return AppAxios.get<IServerInfo.Time>({
    url: '/app/monitor/server/time',
  })
}

export function getNetworkInfoAPI() {
  return AppAxios.get<IServerInfo.Network>(
    {
      url: '/app/monitor/server/network',
    },
  )
}
