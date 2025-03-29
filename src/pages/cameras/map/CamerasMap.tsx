import { Box, Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { MapMarker } from 'react-kakao-maps-sdk'
import MapComponent from 'src/@core/components/map/MapComponent'
import MapSearch from 'src/@core/components/map/MapSearch'
import { defaultMapInfo } from 'src/enum/mapEnum'
import { useCameras } from 'src/hooks/useCameras'
import { useMap } from 'src/hooks/useMap'
import IconCustom from 'src/layouts/components/IconCustom'

interface ICamerasMap {
  height?: string
}

const CamerasMap: React.FC<ICamerasMap> = ({ height = '500px' }) => {
  const { mapInfo, setMapInfo } = useMap()
  const { selectedCamera, mapModifyModCameraId, setSelectedCamera, updateClientCameraData, setMapModifyModCameraId } =
    useCameras()

  useEffect(() => {
    if (selectedCamera) {
      const lat = selectedCamera.zonePoints.lat ?? defaultMapInfo.center.lat
      const lon = selectedCamera.zonePoints.lon ?? defaultMapInfo.center.lon

      setMapInfo({
        ...mapInfo,
        center: {
          lat,
          lon
        },
        markerPosition: {
          lat,
          lon
        }
      })
    }
  }, [selectedCamera])

  const handleMapClick = (map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (mapModifyModCameraId) {
      const lat = mouseEvent.latLng.getLat()
      const lng = mouseEvent.latLng.getLng()

      updateClientCameraData(mapModifyModCameraId, {
        zonePoints: { lat, lon: lng }
      })

      setMapInfo({
        ...mapInfo,
        markerPosition: {
          lat,
          lon: lng
        }
      })

      setMapModifyModCameraId(null)
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <IconCustom isCommon path='camera' icon='map-mode' hoverIcon='map-mode-hovering' />
          </Box>

          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <IconCustom isCommon path='camera' icon='image-mode' hoverIcon='image-mode-hovering' />
          </Box>

          <Box sx={{ flex: 0.7 }}>
            <MapSearch useSearchButton textFieldColor='#fff' />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box style={{ width: '100%', height: height }}>
          <MapComponent onClick={handleMapClick}>
            {mapInfo.markerPosition && (
              <MapMarker position={{ lat: mapInfo.markerPosition.lat, lng: mapInfo.markerPosition.lon }} />
            )}
          </MapComponent>
        </Box>
      </Grid>
    </Grid>
  )
}

export default CamerasMap
