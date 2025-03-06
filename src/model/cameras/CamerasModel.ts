export interface MCameraClient {
  id: number
  clientId: string
  clientNm: string
}

export interface MCameraClientDetail extends MCameraClient {
  desc: string
}

export interface MPoint {
  lat: number | null
  lon: number | null
}

export interface MLocationState {
  selected: MSelectedLocation
  center: MPoint
  selectedNode?: MAreas
  selectAreaId: MSelectAreaId
  isSearch?: boolean
  displayInfo: MDisplayInfo
}

export interface MSelectedLocation {
  areaId: number[]
  subAreaId: number[]
  cameraId: number
}

export interface MAreas {
  areaId: number
  areaName: string
  areaExtName?: string | null
  lat: number
  lon: number
  alarmLevelCount: MAlarmLevelCount[]
  subAreas: MSubAreas[]
}

export interface MSelectAreaId {
  areaId: number
  subAreaId: number
  cameraId: number
}

export interface MDisplayInfo {
  areaId: number[]
  subAreaId: number[]
  cameraId: number[]
}

export interface MAlarmLevelCount {
  alarmLevel: string
  count: number
}

export interface MSubAreas {
  areaId: number
  areaName: string
  lat: number
  lon: number
  highestAlarmLevel: string
  alarmLevelCount: MAlarmLevelCount[]
  instanceStateCount: [
    {
      state: string
      count: number
    }
  ]
  cameras: MCameras[]
  areaExtName: string
}

export interface MCameras {
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
  zonePoints: MZonePoints
  zonePointList?: MPoint[]
  videoPosition: string
  updDt: string
  cameraUpdDt: number
  dataStatus?: number
}

export interface MZonePoints {
  sw: MPoint
  ne: MPoint
  s?: MPoint | undefined
  center?: MPoint | undefined
}
