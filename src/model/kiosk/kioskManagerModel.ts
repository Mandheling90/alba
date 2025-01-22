import { YN } from 'src/enum/commonEnum'

export interface MKioskPartListReq {
  id?: number
}

export interface MKioskPartListUpdateReq {
  id: number
  name: string
  specification: string
}

export interface MKioskPartList {
  id: number
  name: string
  inUse: number
}

export interface MKioskPartTypeList {
  id: number
  name: string
  iconFileName: string
  partList: IPartTypeList[]
}

export interface IPartTypeList {
  id: number
  name: string
  specification: string
  dataStatus: YN
  inUse: number
}

export interface MKioskPartDetail {
  id: number
  name: string
  specification: string
}

export interface MKioskPartReqData {
  id: number
  inUse?: number
  name: string
  specification: string
}

export interface MKioskPartTypeReqTempData {
  id: number
  name: string
  iconFileName: string
  partListId: number
  partListName: string
  specification: string
}

export interface MKioskPartTypeReqData {
  id?: number
  name: string
  iconFileName: string
  partList: IPartListReq[]
}

export interface IPartListReq {
  id?: number
  name: string
  specification: string
  dataStatus?: YN
}
