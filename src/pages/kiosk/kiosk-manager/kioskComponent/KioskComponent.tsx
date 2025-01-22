import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import { FC, useEffect, useRef, useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import KioskScrollHandle from './KioskScrollHandle'

interface IRolesCards {
  children: React.ReactNode
  scrollText: string
  height: string
  onAdd: () => void
}

const KioskComponentList: FC<IRolesCards> = ({ children, scrollText, height, onAdd }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // 스크롤 정보 업데이트
  const updateScrollInfo = () => {
    if (scrollRef.current) {
      setScrollLeft(scrollRef.current.scrollLeft)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      setIsDragging(true)
      setStartX(e.pageX - scrollRef.current.offsetLeft)
      setScrollLeft(scrollRef.current.scrollLeft)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = x - startX

    // const walk = (x - startX) * 0.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // 스크롤 위치 업데이트
  useEffect(() => {
    const handleScroll = () => updateScrollInfo() // 스크롤 위치 업데이트

    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <>
      <Box mb={5} sx={{ display: 'flex', alignItems: 'center' }} gap={5}>
        <KioskScrollHandle scrollText={scrollText} scrollRef={scrollRef} scrollState={scrollLeft} />
        <IconButton
          onClick={() => {
            onAdd()
          }}
        >
          <IconCustom path='kiosk' icon='add-button' />
        </IconButton>
      </Box>
      <Box
        gap={5}
        ref={scrollRef}
        sx={{
          overflowX: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          height: height,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignContent: 'flex-start'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {children}
      </Box>
    </>
  )
}

export default KioskComponentList
