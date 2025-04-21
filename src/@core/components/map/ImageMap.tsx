// interface IImageMap {}

import { Box, Card, IconButton } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import MapControlOverlay from 'src/@core/components/molecule/MapControlOverlay'
import { YN } from 'src/enum/commonEnum'
import { useCameras } from 'src/hooks/useCameras'
import IconCustom from 'src/layouts/components/IconCustom'
import { MFlowPlan } from 'src/model/cameras/CamerasModel'

interface IImageMap {
  flowPlanData?: MFlowPlan
  height: string
  handleImageMapClick: (x: number, y: number) => void
  imageUpdateFn: () => void
  floorplanLocation: () => void
  resizeing: () => void
  onMarkerDrop?: (cameraNo: string, x: number, y: number) => void
}

const ImageMap = ({
  flowPlanData,
  height,
  handleImageMapClick,
  imageUpdateFn,
  floorplanLocation,
  resizeing,
  onMarkerDrop
}: IImageMap): React.ReactElement => {
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const transformWrapperRef = useRef<any>(null)

  const {
    clientCameraData,
    selectedCamera,
    mapModifyModCameraId,
    viewType,
    updateClientCameraData,
    updateGroupCameraData,
    setMapModifyModCameraId,
    setViewType,
    setClientCameraData,
    handleCancelClick,
    handleSaveClick
  } = useCameras()

  const handleMarkerDrag = (cameraNo: number, groupId: number | undefined, x: number, y: number) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    updateClientCameraData(cameraNo, {
      flowPlanX: xPercent,
      flowPlanY: yPercent
    })

    if (groupId) {
      updateGroupCameraData(groupId, cameraNo, {
        flowPlanX: xPercent,
        flowPlanY: yPercent
      })
    }
  }

  const getMarkerPosition = (x: number, y: number) => {
    const container = containerRef.current
    if (!container) return { x: 0, y: 0 }

    const rect = container.getBoundingClientRect()

    // NaN 체크 및 기본값 설정
    const safeX = isNaN(x) ? 0 : x
    const safeY = isNaN(y) ? 0 : y

    return {
      x: (safeX / 100) * rect.width,
      y: (safeY / 100) * rect.height
    }
  }

  useEffect(() => {
    const img = imageRef.current
    const container = containerRef.current
    if (img && container) {
      const updateSizes = () => {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) return

        const containerRect = container.getBoundingClientRect()
        const containerWidth = containerRect.width
        const containerHeight = containerRect.height

        const imageAspectRatio = img.naturalWidth / img.naturalHeight
        const containerAspectRatio = containerWidth / containerHeight

        let displayWidth, displayHeight

        if (imageAspectRatio > containerAspectRatio) {
          displayWidth = containerWidth
          displayHeight = containerWidth / imageAspectRatio
        } else {
          displayHeight = containerHeight
          displayWidth = containerHeight * imageAspectRatio
        }

        setDisplaySize({
          width: displayWidth,
          height: displayHeight
        })
      }

      img.onload = updateSizes

      const resizeObserver = new ResizeObserver(updateSizes)
      resizeObserver.observe(container)
      resizeObserver.observe(img)

      updateSizes()

      return () => {
        resizeObserver.disconnect()
        img.onload = null
      }
    }
  }, [])

  useEffect(() => {
    if (selectedCamera && selectedCamera.length > 0 && transformWrapperRef.current) {
    }
  }, [selectedCamera])

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: height,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Card
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <MapControlOverlay
          buttons={[
            {
              icon: viewType.size === 'half' ? 'zoomIn_default' : 'zoomOut_default',
              hoverIcon: viewType.size === 'half' ? 'zoomIn_hovering' : 'zoomOut_hovering',
              onClick: resizeing
            },
            {
              icon: 'floorplanLoc_default',
              hoverIcon: 'floorplanLoc_hovering',
              onClick: floorplanLocation
            },
            {
              icon: 'image-add-icon',
              hoverIcon: 'image-add-icon_hovering',
              onClick: imageUpdateFn
            }
          ]}
        />

        <TransformWrapper
          ref={transformWrapperRef}
          initialScale={1}
          minScale={0.5}
          maxScale={1.5}
          centerOnInit={true}
          centerZoomedOut={true}
          disabled={isDragging}
          wheel={{
            step: 0.7
          }}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: displaySize.width,
                height: displaySize.height,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              <img
                ref={imageRef}
                src={`${process.env.NEXT_PUBLIC_FLOWPLAN_PATH}/${flowPlanData?.flowPlanImgUrl}`}
                alt='map'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  userSelect: 'none'
                }}
                draggable={false}
              />
              {clientCameraData
                ?.filter(camera => camera.flowPlanBindingYN === YN.Y)
                .map(camera => {
                  const position = getMarkerPosition(camera.flowPlanX ?? 0, camera.flowPlanY ?? 0)

                  return (
                    <Draggable
                      key={camera.cameraNo}
                      position={position}
                      onStart={() => setIsDragging(true)}
                      onStop={(e, data) => {
                        setIsDragging(false)
                        handleMarkerDrag(camera.cameraNo, camera.groupId, data.x, data.y)
                      }}
                      bounds='parent'
                      disabled={!camera.isEdit}
                    >
                      <IconButton
                        onClick={e => e.stopPropagation()}
                        sx={{
                          position: 'absolute',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1000,
                          cursor: 'move',
                          pointerEvents: 'auto'
                        }}
                      >
                        <IconCustom isCommon path='camera' icon='map-point' />
                      </IconButton>
                    </Draggable>
                  )
                })}
            </Box>
          </TransformComponent>
        </TransformWrapper>
      </Card>
    </Box>
  )
}

export default ImageMap
