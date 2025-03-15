import { FC } from 'react'
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk'
import { useMap } from 'src/hooks/useMap'
import { MPoint } from 'src/model/map/MapModel'

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
  const { mapInfo, setMapInfo } = useMap()

  useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY as string, // 발급 받은 APPKEY
    libraries: ['services']
  })

  return (
    <Map
      id='map'
      ref={mapContainerRef}
      center={{
        lat: mapInfo.center.lat ?? 0,
        lng: mapInfo.center.lon ?? 0
      }}
      isPanto={false}
      level={mapInfo.mapLevel}
      style={{ width: '100%', height: '100%' }}
      onDragEnd={map => {
        // setLocationSelect({
        //   ...locationSelectInfo,
        //   center: { lat: map.getCenter().getLat(), lon: map.getCenter().getLng() }
        // })
      }}
      onZoomChanged={map => setMapInfo({ ...mapInfo, mapLevel: map.getLevel() })}
      mapTypeId={mapInfo.mapTypeId ?? 1}
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
