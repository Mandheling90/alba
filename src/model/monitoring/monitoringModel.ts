import { KIOSK_STATUS, POWER_TYPE } from 'src/enum/kisokEnum'

export interface MMonitoringHealth {
  kioskId: number
  kioskName: string
  kioskLocation: string
  remote?: KioskRemote | null
  modules: KioskModule[]
  status: KIOSK_STATUS
  relayIp: string
}

interface KioskRemote {
  id: number
  name: string
  desc: string
  status: number
}

interface KioskModule {
  id: number
  port: number
  name: string
  desc: string | null
  status: number
  powerType: POWER_TYPE
  items: KioskItem[]
}

export interface KioskItem {
  id: number
  name: string
  desc: string
  status: number
}

export interface TcpRelay {
  port: number
  cmd: 'start' | 'check' | 'stop'
  ip?: string
  RelayIP?: string
}

export interface MMonitoringFilter {
  sort: 'asc' | 'desc'
  status: KIOSK_STATUS
  keyWord: string
}
