import { FC, useEffect } from 'react'
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk'
import { defaultMapDisplayInfo, defaultMapInfo } from 'src/enum/mapEnum'
import { useCameras } from 'src/hooks/useCameras'
import { MPoint } from 'src/model/cameras/CamerasModel'

interface IMapComponent {
  mapContainerRef?: any
  isScreen?: boolean
  children?: React.ReactNode
  isIndividual?: boolean
  mapClick?: (value: MPoint) => void
  onClick?: (_map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => void
  handleMouseMove?: (_map: any, mouseEvent: any) => void
  handleRightClick?: (_map: any, mouseEvent: any) => void
}

const MapComponent: FC<IMapComponent> = ({
  mapContainerRef = null,
  isScreen = false,
  isIndividual = false,
  children,
  onClick,
  handleMouseMove,
  handleRightClick
}): React.ReactElement => {
  const { mapLevel, setMapLevel, locationSelect, locationSelectIndividual, setLocationSelect, mapDisplayMode } =
    useCameras()

  const locationSelectInfo = !isIndividual ? locationSelect : locationSelectIndividual

  useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY as string, // 발급 받은 APPKEY
    libraries: ['services']
  })

  useEffect(() => {
    if (locationSelectInfo.selectAreaId.areaId > 0) {
      const extractedCoords = locationSelectInfo.selectedNode?.subAreas.map(subArea => ({
        lat: (subArea.lat ?? 0) > 0 ? subArea.lat ?? 0 : defaultMapInfo.center.lat,
        lng: (subArea.lon ?? 0) > 0 ? subArea.lon ?? 0 : defaultMapInfo.center.lon
      }))

      const map = mapContainerRef.current
      if (map && extractedCoords) {
        const bounds = () => {
          const bounds = new kakao.maps.LatLngBounds()

          extractedCoords.forEach(point => {
            bounds.extend(new kakao.maps.LatLng(point.lat, point.lng))
          })

          return bounds
        }

        map.setBounds(bounds())
      }
    }
  }, [locationSelectInfo.selectAreaId.areaId])

  return (
    <Map
      id='map'
      ref={mapContainerRef}
      center={{
        lat: (locationSelectInfo.center.lat ?? 0) > 0 ? locationSelectInfo.center.lat ?? 0 : defaultMapInfo.center.lat,
        lng: (locationSelectInfo.center.lon ?? 0) > 0 ? locationSelectInfo.center.lon ?? 0 : defaultMapInfo.center.lon
      }}
      isPanto={false}
      level={mapLevel}
      style={{ width: '100%', height: `100%` }}
      onDragEnd={map => {
        setLocationSelect({
          ...locationSelectInfo,
          center: { lat: map.getCenter().getLat(), lon: map.getCenter().getLng() }
        })
      }}
      onZoomChanged={map => setMapLevel(map.getLevel())}
      mapTypeId={mapDisplayMode === defaultMapDisplayInfo.map ? 1 : 3}
      onClick={(_map, mouseEvent) => {
        onClick && onClick(_map, mouseEvent)
      }}
      onRightClick={handleRightClick && handleRightClick}
      onMouseMove={handleMouseMove && handleMouseMove}

      // onCreate={setMap}
      // maxLevel={5}
    >
      {children && children}
    </Map>
  )
}

export default MapComponent
