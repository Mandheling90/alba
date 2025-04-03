import { Box, Grid } from '@mui/material'
import React, { useContext, useEffect, useRef } from 'react'
import { MapMarker } from 'react-kakao-maps-sdk'
import MapComponent from 'src/@core/components/map/MapComponent'

import ImageMap from 'src/@core/components/map/ImageMap'
import MapSearch from 'src/@core/components/map/MapSearch'
import { CamerasContext } from 'src/context/CamerasContext'
import { defaultMapInfo } from 'src/enum/mapEnum'
import { useLayout } from 'src/hooks/useLayout'
import { useMap } from 'src/hooks/useMap'
import IconCustom from 'src/layouts/components/IconCustom'
import CameraSelecter from './CameraSelecter'

interface ICamerasMap {
  height?: string
}

const CamerasMap: React.FC<ICamerasMap> = ({ height = '500px' }) => {
  const { mapInfo, setMapInfo } = useMap()
  const layoutContext = useLayout()
  const { layoutDisplay } = layoutContext

  const {
    selectedCamera,
    mapModifyModCameraId,
    viewType,
    updateClientCameraData,
    setMapModifyModCameraId,
    setViewType
  } = useContext(CamerasContext)

  const mapContainerRef = useRef<any>()

  useEffect(() => {
    if (selectedCamera) {
      const markerPositions = selectedCamera.map(camera => {
        const lat = camera.zonePoints?.lat ?? defaultMapInfo.center.lat
        const lon = camera.zonePoints?.lon ?? defaultMapInfo.center.lon

        return {
          lat,
          lon
        }
      })

      setMapInfo({
        ...mapInfo,
        markerPositions: markerPositions
      })

      const map = mapContainerRef.current
      if (map && markerPositions) {
        setTimeout(() => {
          const bounds = () => {
            const bounds = new kakao.maps.LatLngBounds()

            markerPositions.forEach(point => {
              bounds.extend(new kakao.maps.LatLng(point.lat, point.lon))
            })

            return bounds
          }

          map.setBounds(bounds())
        }, 100)
      }
    }
  }, [selectedCamera])

  useEffect(() => {
    setTimeout(() => {
      const relayout = () => {
        mapContainerRef.current?.relayout()
      }

      relayout()
    }, 500)
  }, [height, layoutDisplay])

  const handleMapClick = (map: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (mapModifyModCameraId) {
      const lat = mouseEvent.latLng.getLat()
      const lng = mouseEvent.latLng.getLng()

      updateClientCameraData(mapModifyModCameraId, {
        zonePoints: { lat, lon: lng }
      })

      setMapInfo({
        ...mapInfo,
        markerPositions: [
          {
            lat,
            lon: lng
          }
        ]
      })

      setMapModifyModCameraId(null)
    }
  }

  const handleImageMapClick = (x: number, y: number) => {
    if (mapModifyModCameraId) {
      updateClientCameraData(mapModifyModCameraId, {
        markers: { x, y }
      })

      setMapModifyModCameraId(null)
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {viewType.type === 'map' && viewType.size === 'full' ? (
            <Box
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => setViewType({ type: 'map', size: 'half' })}
            >
              <IconCustom isCommon path='camera' icon='map-mode-half' hoverIcon='map-mode-half-hovering' />
            </Box>
          ) : (
            <Box
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => setViewType({ type: 'map', size: `${viewType.type === 'map' ? 'full' : 'half'}` })}
            >
              <IconCustom isCommon path='camera' icon='map-mode-full' hoverIcon='map-mode-full-hovering' />
            </Box>
          )}

          <Box
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() =>
              setViewType({
                type: 'image',
                size: `${viewType.type === 'image' ? (viewType.size === 'full' ? 'half' : 'full') : 'half'}`
              })
            }
          >
            <IconCustom isCommon path='camera' icon='image-mode' hoverIcon='image-mode-hovering' />
          </Box>

          <Box sx={{ flex: 0.7 }}>
            <MapSearch useSearchButton textFieldColor='#fff' />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box style={{ width: '100%', height: height }}>
          {viewType.size === 'full' && <CameraSelecter />}

          {viewType.type === 'map' ? (
            <MapComponent onClick={handleMapClick} mapContainerRef={mapContainerRef}>
              {mapInfo.markerPositions &&
                mapInfo.markerPositions.map((position, index) => (
                  <MapMarker key={index} position={{ lat: position.lat, lng: position.lon }} />
                ))}
            </MapComponent>
          ) : (
            <ImageMap height={height} handleImageMapClick={handleImageMapClick} />
          )}
        </Box>
      </Grid>
    </Grid>
  )
}

export default CamerasMap
