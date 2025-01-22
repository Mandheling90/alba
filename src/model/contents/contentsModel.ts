import { SORT, YN } from 'src/enum/commonEnum'
import { CONTENTS_TYPE, PROMO } from 'src/enum/contentsEnum'

export interface MContentReq {
  id?: number
  sort?: string
  order?: SORT
  keyword?: string
  startDate?: string
  endDate?: string
}

export interface MKioskList {
  id: number
  name: string
}
export interface MContent {
  id: number
  contentsTypeId: CONTENTS_TYPE
  name: string
  postStartDate: string // Date 타입을 사용할 수 있지만, 현재 string으로 되어 있으므로 그대로 유지
  postEndDate: string // Date 타입을 사용할 수 있지만, 현재 string으로 되어 있으므로 그대로 유지
  type: PROMO
  creator: string
  tag: string
  filePath: string
  priorityType: number
  expireType: number
  dataStatus: YN
  kioskList: MKioskList[]

  file?: File | null
  kioskIdList?: number[]
}

export interface IKioskContent {
  contentsId: number
  contentsName: string
}

export interface MKioskContentList {
  kioskId: number
  kioskName: string
  contentsList: IKioskContent[]
}

export interface MContentsDeleteReq {
  id: number
  kioskIdList: number[]
}
