import { Box, Grid } from '@mui/material'
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
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ my: 2 }}>
          <MapSearch useSearchButton textFieldColor='#fff' />
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
