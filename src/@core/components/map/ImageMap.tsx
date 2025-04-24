// interface IImageMap {}

import { Box, Card, Typography } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CamerasContext } from 'src/context/CamerasContext'
import { YN } from 'src/enum/commonEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import { MClientCameraList, MFlowPlan } from 'src/model/cameras/CamerasModel'
import MapControlOverlay from '../molecule/MapControlOverlay'
import OverlayBox from '../molecule/OverlayBox'

interface IImageMap {
  flowPlanData?: MFlowPlan
  height: string
  handleImageMapClick: (x: number, y: number) => void
  imageUpdateFn: () => void
  floorplanLocation: () => void
  resizeing: () => void
}

const Marker = ({
  camera,
  imageRef,
  isDraggable
}: {
  camera: MClientCameraList
  imageRef: React.RefObject<HTMLDivElement>
  isDraggable: boolean
}) => {
  const { selectedCamera, updateClientCameraData } = useContext(CamerasContext)
  const x = camera.flowPlanX ?? 0
  const y = camera.flowPlanY ?? 0
  const [showOverlay, setShowOverlay] = useState(false)
  const [onMouseDownMarker, setOnMouseDownMarker] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag<any, any, { isDragging: boolean }>(
    () => ({
      type: 'marker',
      item: { cameraNo: camera.cameraNo },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        const container = imageRef.current
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        const clientOffset = monitor.getClientOffset()
        if (!clientOffset) return

        const x = ((clientOffset.x - containerRect.left) / containerRect.width) * 100
        const y = ((clientOffset.y - containerRect.top) / containerRect.height) * 100

        const clampedX = Math.max(0, Math.min(100, x))
        const clampedY = Math.max(0, Math.min(100, y))

        if (isDraggable) {
          updateClientCameraData(camera.cameraNo, { flowPlanX: clampedX, flowPlanY: clampedY })
        }
        setShowOverlay(false)
        setOnMouseDownMarker(false)
      }
    }),
    [isDraggable, camera.cameraNo, imageRef, updateClientCameraData, selectedCamera]
  )

  useEffect(() => {
    if (isDragging) {
      setShowOverlay(false)
    }
  }, [isDragging])

  useEffect(() => {
    if (dragRef.current) {
      const dragImage = dragRef.current.cloneNode(true) as HTMLElement
      dragImage.style.position = 'absolute'
      dragImage.style.top = '-1000px'
      dragImage.style.opacity = '0.8'
      dragImage.style.transform = 'scale(1.2)'
      document.body.appendChild(dragImage)

      const cleanup = () => {
        document.body.removeChild(dragImage)
      }

      return cleanup
    }
  }, [])

  console.log(selectedCamera)
  console.log(showOverlay)

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        zIndex: isDragging ? 2000 : 1000,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseEnter={() => !isDragging && setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
    >
      {!isDragging && (selectedCamera?.find(camera => camera.cameraNo === camera.cameraNo) || showOverlay) && (
        <div
          style={{
            display: onMouseDownMarker ? 'none' : 'block',
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }}
        >
          <OverlayBox marginTop='-55px'>
            <Typography>{`${camera.cameraId} | ${camera.cameraName}`}</Typography>
          </OverlayBox>
        </div>
      )}

      <div
        ref={dragRef}
        onMouseDown={e => {
          if (e.button === 0) {
            setOnMouseDownMarker(true)
          }
        }}
      >
        <IconCustom isCommon path='camera' icon='map-point' />
      </div>
    </div>
  )
}

const ImageMap = ({
  flowPlanData,
  height,
  handleImageMapClick,
  imageUpdateFn,
  floorplanLocation,
  resizeing
}: IImageMap): React.ReactElement => {
  const { clientCameraData, selectedCamera, viewType, updateClientCameraData } = useContext(CamerasContext)

  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [initialDisplaySize, setInitialDisplaySize] = useState({ width: 0, height: 0 })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 선택된 카메라가 변경될 때마다 해당 카메라의 위치로 이동
  useEffect(() => {
    if (selectedCamera && selectedCamera.length === 1) {
      const camera = selectedCamera[0]
      const x = camera.flowPlanX ?? 0
      const y = camera.flowPlanY ?? 0

      // 컨테이너와 이미지 크기 계산
      const container = containerRef.current
      const img = imageRef.current
      if (!container || !img) return

      const containerRect = container.getBoundingClientRect()
      const imageWidth = displaySize.width * zoomLevel
      const imageHeight = displaySize.height * zoomLevel

      // 선택된 카메라의 위치를 중앙으로 이동하기 위한 새로운 position 계산
      const newX = containerRect.width / 2 - (imageWidth * x) / 100
      const newY = containerRect.height / 2 - (imageHeight * y) / 100

      setPosition({ x: newX, y: newY })
    }
  }, [selectedCamera, displaySize, zoomLevel])

  const handleMouseDown = (e: React.MouseEvent) => {
    // 마커가 드래그 중일 때는 이미지 드래그 방지
    if ((e.target as HTMLElement).closest('.marker-draggable')) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    setPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY
    const zoomFactor = 0.1

    // 컨테이너 크기와 초기 이미지 크기의 비율을 계산하여 최소 줌 레벨 결정
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const minZoomX = containerRect.width / initialDisplaySize.width
    const minZoomY = containerRect.height / initialDisplaySize.height
    const minZoom = Math.min(minZoomX, minZoomY)

    const MAX_ZOOM = 1.5 // 최대 확대 범위를 1.5로 제한
    const newZoom = delta > 0 ? Math.max(minZoom, zoomLevel - zoomFactor) : Math.min(MAX_ZOOM, zoomLevel + zoomFactor)

    setZoomLevel(newZoom)
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

        // 이미지의 실제 표시 크기 계산
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
        setInitialDisplaySize({
          width: displayWidth,
          height: displayHeight
        })

        // 이미지를 중앙에 위치시키기 위한 초기 position 계산
        const initialX = (containerWidth - displayWidth) / 2
        const initialY = (containerHeight - displayHeight) / 2
        setPosition({ x: initialX, y: initialY })
      }

      // 이미지 로드 완료 후 크기 업데이트
      img.onload = updateSizes

      // ResizeObserver 설정
      const resizeObserver = new ResizeObserver(updateSizes)
      resizeObserver.observe(container)
      resizeObserver.observe(img)

      // 초기 크기 설정
      updateSizes()

      return () => {
        resizeObserver.disconnect()
        img.onload = null
      }
    }
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <Card>
        <Box
          ref={containerRef}
          sx={{
            height,
            overflow: 'hidden',
            padding: 0,
            position: 'relative',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
          draggable={false}
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
          <Box
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = ((e.clientX - rect.left) / rect.width) * 100
              const y = ((e.clientY - rect.top) / rect.height) * 100

              handleImageMapClick(x, y)
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            draggable={false}
            sx={{
              position: 'relative',
              width: displaySize.width,
              height: displaySize.height,
              maxWidth: '100%',
              maxHeight: '100%',
              cursor: isDragging ? 'grabbing' : 'grab',
              transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
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
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              draggable={false}
            />
            {clientCameraData
              ?.filter(camera => camera.flowPlanBindingYN === YN.Y)
              .map(camera => (
                <Marker
                  key={camera.cameraNo}
                  camera={camera}
                  imageRef={imageRef}
                  isDraggable={camera.isEdit ?? false}
                />
              ))}
          </Box>
        </Box>
      </Card>
    </DndProvider>
  )
}

export default ImageMap
