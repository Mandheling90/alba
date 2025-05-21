import { SORT, YN } from 'src/enum/commonEnum'
import { IAiSolutionService, SERVICE_TYPE } from '../client/clientModel'

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

  isEdit?: boolean // 프론트에서 사용
}

export interface MGroupList {
  id: number
  groupName: string
}

export interface MClientCameraList {
  cameraNo: number
  cameraId: string
  cameraName: string
  aiSolutionServiceResDtoList: IAiSolutionService[]
  lon: number | null
  lat: number | null
  flowPlanX: number | null
  flowPlanY: number | null
  flowPlanBindingYN: YN
  cameraStatus: YN

  groupItemId?: number
  groupId?: number
  isEdit?: boolean // 프론트에서 사용
}

export interface MClientCameraListForSave {
  cameraNo: number
  cameraId: string
  cameraName: string
  aiSolutionServiceResDtoList: IAiSolutionService[]
  lon?: number | null
  lat?: number | null
  flowPlanX?: number | null
  flowPlanY?: number | null
  flowPlanBindingYN: YN
  cameraStatus: YN

  groupItemId?: number
  groupId?: number

  isEdit?: boolean // 프론트에서 사용
}

export interface MClientGroupCameraList {
  groupId: number
  userNo: number
  groupName: string
  groupItemList: MClientCameraList[]

  isNew?: boolean // 프론트에서 사용
}

export interface MClientGroupList {
  groupId: number
  userNo: number
  groupName: string
}

export interface MFlowPlan {
  cameraFlowPlanNo: number
  flowPlanImgUrl: string
  lon: number
  lat: number
}

export interface MFlowPlanUpdate {
  lon: number
  lat: number
}
