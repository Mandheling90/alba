import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

import 'video-react/dist/video-react.css' // Video-React 스타일 시트

interface CardVideoPlayerProps {
  src: string
  width?: number
}

export interface CardVideoPlayerHandle {
  enterFullscreen: () => void
  exitFullscreen: () => void
}

const CardVideoPlayer = forwardRef<CardVideoPlayerHandle, CardVideoPlayerProps>(({ src, width }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const enterFullscreen = () => {
    setIsPlaying(true)

    if (videoRef.current) {
      const videoElement = videoRef.current as any
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen()
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen()
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen()
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen()
      }
      setIsFullscreen(true)
    }
  }

  const exitFullscreen = () => {
    const documentElement = document as any

    if (documentElement.exitFullscreen) {
      documentElement.exitFullscreen()
    } else if (documentElement.webkitExitFullscreen) {
      documentElement.webkitExitFullscreen()
    } else if (documentElement.mozCancelFullScreen) {
      documentElement.mozCancelFullScreen()
    } else if (documentElement.msExitFullscreen) {
      documentElement.msExitFullscreen()
    }
    setIsFullscreen(false)
  }

  useImperativeHandle(ref, () => ({
    enterFullscreen,
    exitFullscreen
  }))

  useEffect(() => {
    const handleFullscreenChange = () => {
      const documentElement = document as any

      if (
        documentElement.fullscreenElement === videoRef.current ||
        documentElement.webkitFullscreenElement === videoRef.current ||
        documentElement.mozFullScreenElement === videoRef.current ||
        documentElement.msFullscreenElement === videoRef.current
      ) {
        setIsFullscreen(true)
      } else {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // src 변경 시 비디오 다시 로드
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load() // 비디오를 다시 로드
      setIsPlaying(false) // 새로운 영상이므로 재생 상태 초기화
    }
  }, [src])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: isFullscreen ? '100vw' : `100%`,
        height: isFullscreen ? '100vh' : '100%',
        backgroundColor: 'white',
        overflow: 'hidden'
      }}
    >
      {!isPlaying && !isFullscreen && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            zIndex: 1
          }}
          onClick={handlePlay}
        >
          {/* 플레이 버튼 */}
          <IconCustom isCommon icon='video-play' />
        </div>
      )}
      <video
        ref={videoRef}
        style={{
          width: isFullscreen ? '100%' : `100%`,
          height: isFullscreen ? '100%' : '100%',
          backgroundColor: 'black',
          display: isPlaying || isFullscreen ? 'inline' : 'none'
        }}
        controls={isPlaying} // 재생 중일 때만 컨트롤 표시
      >
        <source src={src} type='video/mp4' />
      </video>
    </div>
  )
})

export default React.memo(CardVideoPlayer)
