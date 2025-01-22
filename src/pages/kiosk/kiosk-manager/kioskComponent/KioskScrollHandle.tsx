import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useEffect, useRef, useState } from 'react'

interface ScrollHandleProps {
  scrollText: string
  scrollState?: number
  scrollRef: React.RefObject<HTMLDivElement>
}

const KioskScrollHandle: React.FC<ScrollHandleProps> = ({ scrollText, scrollState = 0, scrollRef }) => {
  const boxRef = useRef<HTMLDivElement | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [handlePosition, setHandlePosition] = useState(0)
  const [handleWidth, setHandleWidth] = useState(100)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 전파 방지
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current || !boxRef.current) return

    const moveX = e.clientX - startX
    const boxWidth = boxRef.current.clientWidth
    const maxHandlePosition = boxWidth - handleWidth

    const newPosition = Math.max(0, Math.min(maxHandlePosition, handlePosition + moveX))
    setHandlePosition(newPosition)

    const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth
    const scrollFactor = maxScrollLeft / maxHandlePosition
    scrollRef.current.scrollLeft = scrollFactor * newPosition

    setStartX(e.clientX)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 전파 방지
    setIsDragging(false)
  }

  const updateHandleWidth = () => {
    if (scrollRef.current && boxRef.current) {
      const visibleAreaWidth = scrollRef.current.clientWidth
      const totalScrollWidth = scrollRef.current.scrollWidth

      const boxWidth = boxRef.current.clientWidth
      const newHandleWidth = (visibleAreaWidth / totalScrollWidth) * boxWidth
      setHandleWidth(Math.max(30, newHandleWidth))
    }
  }

  useEffect(() => {
    const handleScroll = () => updateHandleWidth()

    if (scrollRef.current && boxRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll)
      updateHandleWidth()
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollRef.current?.clientWidth, scrollRef.current?.scrollWidth, boxRef.current?.clientWidth])

  useEffect(() => {
    if (scrollRef.current && boxRef.current) {
      const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      const boxWidth = boxRef.current.clientWidth
      const maxHandlePosition = boxWidth - handleWidth

      const newPosition = (scrollState / maxScrollLeft) * maxHandlePosition
      setHandlePosition(newPosition)
    }
  }, [scrollState, handleWidth])

  return (
    <Box
      ref={boxRef}
      sx={{
        width: '20%',
        height: '36px',
        backgroundColor: '#fff',
        position: 'relative',
        borderRadius: '5px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Typography fontSize={24} fontWeight={500} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
        {scrollText}
      </Typography>

      <Box
        sx={{
          width: `${handleWidth}px`,
          height: '100%',
          backgroundColor: 'rgba(158, 105, 253, 0.15)',
          position: 'absolute',
          left: `${handlePosition}px`,
          cursor: 'grab',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
      />
    </Box>
  )
}

export default KioskScrollHandle
