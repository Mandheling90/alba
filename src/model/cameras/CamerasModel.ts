import { SORT } from 'src/enum/commonEnum'
import { SERVICE_TYPE } from '../client/clientModel'

export interface ICameraClientReq {
  id?: number
  sort?: string
  order?: SORT
  keyword?: string
}

export interface ICameraClientDetailReq {
  id?: number
  clientId: string
}

export interface ICameraClient {
  id: number
  clientId: string
  clientNm: string
}

export interface IPoint {
  lat: number | null
  lon: number | null
}

export interface ILocationState {
  selected: ISelectedLocation
  center: IPoint
  selectedNode?: IAreas
  selectAreaId: ISelectAreaId
  isSearch?: boolean
  displayInfo: IDisplayInfo
}

export interface ISelectedLocation {
  areaId: number[]
  subAreaId: number[]
  cameraId: number
}

export interface IAreas {
  areaId: number
  areaName: string
  areaExtName?: string | null
  lat: number
  lon: number
  alarmLevelCount: IAlarmLevelCount[]
  subAreas: ISubAreas[]
}

export interface ISelectAreaId {
  areaId: number
  subAreaId: number
  cameraId: number
}

export interface IDisplayInfo {
  areaId: number[]
  subAreaId: number[]
  cameraId: number[]
}

export interface IAlarmLevelCount {
  alarmLevel: string
  count: number
}

export interface ISubAreas {
  areaId: number
  areaName: string
  lat: number
  lon: number
  highestAlarmLevel: string
  alarmLevelCount: IAlarmLevelCount[]
  instanceStateCount: [
    {
      state: string
      count: number
    }
  ]
  cameras: ICameras[]
  areaExtName: string
}

export interface ICameras {
  cameraId: number
  cameraName: string
  cameraExtName?: string
  cameraDesc: string | null
  alarmLevel: string | null
  peopleCount: number
  peoplePerArea: number
  progressRatio: number
  totalSquareMeter: number
  hlsUrl: string
  cameraLabel: string
  areaExtName: string
  zonePoints: IZonePoints
  zonePointList?: IPoint[]
  videoPosition: string
  updDt: string
  cameraUpdDt: number
  dataStatus?: number
}

export interface IZonePoints {
  sw: IPoint
  ne: IPoint
  s?: IPoint | undefined
  center?: IPoint | undefined
}

export interface IMarkers {
  x: number
  y: number
}

export interface MCameraList {
  id: number
  cameraId: string
  cameraName: string
  serviceTypes: SERVICE_TYPE[]
  isUse: boolean
  zonePoints?: IPoint
  markers?: IMarkers
  groupId: number | null
}
export interface MGroupList {
  id: number
  groupName: string
}

export interface MClientCameraList {
  cameraList: MCameraList[]
  groupList: MGroupList[]

  floorPlan?: {
    floorPlanImageUrl: string
    zonePoints?: IPoint
  }
}
