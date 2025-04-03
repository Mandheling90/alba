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
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = imageRef.current
    const container = containerRef.current
    if (img && container) {
      const updateSizes = () => {
        const containerRect = container.getBoundingClientRect()
        const containerWidth = containerRect.width
        const containerHeight = containerRect.height

        // 이미지의 실제 표시 크기 계산
        const imageAspectRatio = img.naturalWidth / img.naturalHeight
        const containerAspectRatio = containerWidth / containerHeight

        let displayWidth, displayHeight

        if (imageAspectRatio > containerAspectRatio) {
          // 이미지가 컨테이너보다 더 넓은 경우
          displayWidth = containerWidth
          displayHeight = containerWidth / imageAspectRatio
        } else {
          // 이미지가 컨테이너보다 더 좁은 경우
          displayHeight = containerHeight
          displayWidth = containerHeight * imageAspectRatio
        }

        setDisplaySize({
          width: displayWidth,
          height: displayHeight
        })
      }

      // ResizeObserver 설정
      const resizeObserver = new ResizeObserver(updateSizes)
      resizeObserver.observe(container)

      // 초기 크기 설정
      updateSizes()

      return () => {
        resizeObserver.disconnect()
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
          position: 'relative'
        }}
      >
        <img
          ref={imageRef}
          src='/images/sample.png'
          alt='map'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = ((e.clientX - rect.left) / rect.width) * 100
              const y = ((e.clientY - rect.top) / rect.height) * 100

              handleImageMapClick(x, y)
            }}
            sx={{
              position: 'relative',
              width: displaySize.width,
              height: displaySize.height,
              maxWidth: '100%',
              maxHeight: '100%',
              cursor: 'pointer'
            }}
          >
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
      </Box>
    </Card>
  )
}

export default ImageMap
