// interface IImageMap {}

import { Box, Card, IconButton } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import { CamerasContext } from 'src/context/CamerasContext'
import IconCustom from 'src/layouts/components/IconCustom'

interface IImageMap {
  height: string
  handleImageMapClick: (x: number, y: number) => void
}

const ImageMap = ({ height, handleImageMapClick }: IImageMap): React.ReactElement => {
  const { clientCameraData } = useContext(CamerasContext)

  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
    const newZoom = delta > 0 ? Math.max(0.5, zoomLevel - zoomFactor) : Math.min(3, zoomLevel + zoomFactor)

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
          {clientCameraData?.cameraList.map(camera => {
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
