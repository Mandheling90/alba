import React, { useEffect, useRef, useState } from 'react'
import { MapMarker } from 'react-kakao-maps-sdk'
import { YN } from 'src/enum/commonEnum'

import { useCameras } from 'src/hooks/useCameras'
import { useLayout } from 'src/hooks/useLayout'
import MapOverlay from './MapOverlay'

const INITIAL_DIALOG_PROPS = {
  open: false,
  title: '',
  contents: '',
  isSave: false,
  isImageUpdate: false
}

interface ICamerasMap {
  height?: string
}

const CameraMapMarker: React.FC<ICamerasMap> = ({ height = '500px' }) => {
  const layoutContext = useLayout()
  const { layoutDisplay } = layoutContext

  const mapContainerRef = useRef<any>()
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const {
    clientCameraData,
    selectedCamera,

    updateClientCameraData
  } = useCameras()

  useEffect(() => {
    setTimeout(() => {
      const relayout = () => {
        mapContainerRef.current?.relayout()
      }

      relayout()
    }, 500)
  }, [height, layoutDisplay, isDragging])

  return (
    <>
      {clientCameraData
        ?.filter(camera => camera.flowPlanBindingYN === YN.N)
        .map(camera => (
          <>
            {(isHovering || selectedCamera?.find(c => c.cameraNo === camera.cameraNo)) && (
              <MapOverlay
                title={`${camera.cameraId} | ${camera.cameraName}`}
                position={{
                  lat: camera.lat ?? 0,
                  lng: camera.lon ?? 0
                }}
              />
            )}

            <MapMarker
              position={{
                lat: camera.lat ?? 0,
                lng: camera.lon ?? 0
              }}
              draggable={camera.isEdit}
              onDragEnd={e => {
                const lat = e.getPosition().getLat()
                const lng = e.getPosition().getLng()
                updateClientCameraData(camera.cameraNo, {
                  lat,
                  lon: lng
                })
              }}
              image={{ src: '/images/common/map/map-point.svg', size: { width: 40, height: 40 } }}
              onMouseOver={() => {
                setIsHovering(true)
              }}
              onMouseOut={() => {
                setIsHovering(false)
              }}
            ></MapMarker>
          </>
        ))}
    </>
  )
}

export default CameraMapMarker
