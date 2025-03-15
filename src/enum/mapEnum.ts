export const defaultMapDisplayInfo = {
  map: 'Map',
  satellite: 'satellite'
} as const

export const defaultMapInfo = {
  mapLevel: 7,
  cameraEventMapLevel: 1,
  subAreaEventMapLevel: 3,
  areaEventMapLevel: 4,
  center: { lat: 37.53687, lon: 126.9758 },
  mapTypeId: 1 // 1: 일반 지도, 3: 위성 지도
} as const
