import { Box } from '@mui/material'
import React from 'react'
import { MapMarker } from 'react-kakao-maps-sdk'
import MapComponent from 'src/@core/components/map/MapComponent'
import MapSearch from 'src/@core/components/map/MapSearch'
import { useMap } from 'src/hooks/useMap'

interface ICamerasMap {
  height?: string
}

const CamerasMap: React.FC<ICamerasMap> = ({ height = '500px' }) => {
  const { mapInfo, setMapInfo } = useMap()

  const handleMapClick = (map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    const lat = mouseEvent.latLng.getLat()
    const lng = mouseEvent.latLng.getLng()
    setMapInfo({
      ...mapInfo,
      markerPosition: { lat, lon: lng }
    })
  }

  return (
    <Box style={{ width: '100%', height: height }}>
      <MapSearch />
      <MapComponent onClick={handleMapClick}>
        {mapInfo.markerPosition && (
          <MapMarker position={{ lat: mapInfo.markerPosition.lat, lng: mapInfo.markerPosition.lon }} />
        )}
      </MapComponent>
    </Box>
  )
}

export default CamerasMap
