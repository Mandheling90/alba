// interface IImageMap {}

import { Box, Card, IconButton } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import { CamerasContext } from 'src/context/CamerasContext'
import IconCustom from 'src/layouts/components/IconCustom'

interface IImageMap {
  height: string
  handleImageMapClick: (x: number, y: number) => void
  imageUpdateFn: () => void
  floorplanLocation: () => void
  resizeing: () => void
}

const ImageMap = ({
  height,
  handleImageMapClick,
  imageUpdateFn,
  floorplanLocation,
  resizeing
}: IImageMap): React.ReactElement => {
  const { clientCameraData, selectedCamera } = useContext(CamerasContext)

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
      const x = camera.markers?.x ?? 0
      const y = camera.markers?.y ?? 0

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

  console.log(selectedCamera)

  return (
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
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'flex-end'
          }}
        >
          <Box onClick={resizeing}>
            <IconCustom isCommon path='camera' icon='floorplanLoc_default' hoverIcon='floorplanLoc_hovering' />
          </Box>
          <Box onClick={floorplanLocation}>
            <IconCustom isCommon path='camera' icon='floorplanLoc_default' hoverIcon='floorplanLoc_hovering' />
          </Box>
          <Box onClick={imageUpdateFn}>
            <IconCustom isCommon path='camera' icon='image-add-icon' hoverIcon='image-add-icon_hovering' />
          </Box>
        </Box>
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
            src='/images/sample.png'
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
          {clientCameraData?.cameraList
            .filter(camera => {
              // 선택된 카메라가 없거나 빈 배열인 경우 모든 카메라 표시
              if (!selectedCamera || selectedCamera.length === 0) return true

              // 선택된 카메라 배열에 현재 카메라가 포함되어 있는지 확인
              return selectedCamera.some(selected => selected.id === camera.id)
            })
            .map(camera => {
              const x = camera.markers?.x ?? 0
              const y = camera.markers?.y ?? 0

              return (
                <IconButton
                  key={camera.id}
                  onClick={() => {
                    console.log('')
                  }}
                  sx={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000
                  }}
                >
                  <IconCustom isCommon path='camera' icon='map-point' />
                </IconButton>
              )
            })}
        </Box>
      </Box>
    </Card>
  )
}

export default ImageMap
