import { YN } from 'src/enum/commonEnum'
import { CONTENTS_TYPE } from 'src/enum/contentsEnum'
import { KIOSK_STATUS } from 'src/enum/kisokEnum'

export interface KioskListReq {
  id?: number
  keyword?: string
  status?: KIOSK_STATUS
}

interface KioskType {
  name: string
  status: string
  typeId: number
}

interface KioskPart {
  name: string
  specification: string
  quantity: number
  dataStatus: string
}

interface statistics {
  totalCount: number
  peopleCount: number
  smokerCount: number
  squareMeter: number
  timeStamp: number
}

interface statsList {
  areaId: number
  areaName: string
  statistics: statistics[]
}

export interface MKiosk {
  id: number
  name: string
  location: string
  kioskStatus: KIOSK_STATUS
  kioskType: KioskType
  kioskIp: string
  temp: number
  kioskContentsList: string[] // Empty array implies unknown content type
  kioskPartList: KioskPart[]
  statsList: statsList[]

  ip: string
  relayIp: string
}

export interface MKioskManage {
  name: string
  location: string
  kioskTypeId: number
  kioskPartList: KioskPart[]
}

export interface IPartList {
  id: number
  isUsed?: boolean
  name: string
  quantity: number
}

export interface IPartListReq {
  id: number
  isUsed?: boolean
  name?: string
  quantity: number
}

export interface MKioskType {
  id: number
  name: string
  dataStatus: string
  kioskCount: number
  partList: IPartList[]
}

export interface MKioskTypeReq {
  id?: number
  name: string
  dataStatus?: string
  partList: IPartListReq[]
}

export interface MKioskContent {
  id: number
  contentsId: number
  contentsName: string
  priority: number
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  fileName: string
  dataStatus: YN
  forceUpdated: boolean
  contentsTypeId: CONTENTS_TYPE
  filePath: string
}

export interface MKioskContentReq {
  id: number
  contentsId: number
  contentsName?: string
  priority?: number
  startTime?: string
  endTime?: string
  dataStatus?: YN
  forceUpdated?: boolean
}

export interface MKioskUpdateReq {
  id: number
  name?: string
  location?: string
  kioskStatus?: KIOSK_STATUS
  kioskTypeId?: number

  ip: string
  relayIp: string
}

export interface MKioskDeleteReq {
  id: number
  kioskContentsIdList?: number[]
}

export interface MKioskHealth {
  kioskId: number
  status: number
}

export interface MKioskCardSlider {
  kioskId: number
  index: number
}
