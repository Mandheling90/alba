export interface MAlertListParams {
  item: string
  cameraIds: string
  startDate: string
  endDate: string
  page: number
  size: number
}
export interface MAlertList {
  totalCount: number
  resultCount: number
  data: alerts
}

export interface MAlertDetail {
  cropHlsUrl: string
  peopleCount: number
  totalSquareMeter: number
  alarmLevel: string
  eventImgPath: string
  areaName: string
  areaExtName: string
  lat: number
  lon: number
  cameraName: string
  cameraDesc: string
  regDt: string
  peoplePerArea: number
}

export interface alerts {
  alerts: MAlerts[]
}
export interface MAlerts {
  eventId: number
  eventImgPath: string
  alarmLevel: string
  regDt: string
  regStartTime: string
  regEndTime: string
  areaName: string
  areaExtName: string
  cameraName: string
  cameraDesc: string
  targetSvr: string
}

export interface MAlertSendParm {
  cameraId: number
  alarmLevel: string
  userAction: string
}

export interface MAlertSendAreaParm {
  areaId: number
}
