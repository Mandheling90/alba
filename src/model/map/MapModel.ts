export interface MMapInfo {
  mapLevel: number
  cameraEventMapLevel: number
  subAreaEventMapLevel: number
  areaEventMapLevel: number
  center: MPoint
  mapTypeId: number
  markerPosition?: MPoint
}

export interface MPoint {
  lat: number
  lon: number
}
