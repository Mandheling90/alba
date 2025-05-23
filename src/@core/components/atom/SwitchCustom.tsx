import { grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'

interface ISwitchCustom {
  isSuperChange?: boolean
  switchName?: string[]
  activeColor?: string[]
  width?: number
  selected?: boolean
  superSelected?: boolean

  onChange?: (selected: boolean) => void
  onSuperChange?: (selected: boolean) => void
}

const SwitchCustom: React.FC<ISwitchCustom> = ({
  isSuperChange = false,
  switchName = ['on', 'off'],
  activeColor = ['rgba(145, 85, 253, 1)', '#FF8C00'],
  width = 100,
  selected = true,
  superSelected = false,
  onChange,
  onSuperChange
}) => {
  const [isToggled, setIsToggled] = useState(selected)
  const [isSuperToggled, setIsSuperToggled] = useState(superSelected)

  useEffect(() => {
    setIsToggled(selected)
    setIsSuperToggled(superSelected)
  }, [selected, superSelected])

  const handleToggle = () => {
    if (isSuperChange) {
      // isSuperChange가 true인 경우 미선택된 항목의 배경색만 토글
      setIsSuperToggled(!isSuperToggled)
      onSuperChange?.(!isSuperToggled)
    } else {
      // 일반적인 토글 동작
      setIsToggled(!isToggled)
      onChange?.(!isToggled)
    }
  }

  return (
    <Container
      onClick={handleToggle}
      isWidth={width}
      isSuperChange={isSuperChange}
      isSuperToggled={isSuperToggled}
      borderColor={activeColor[1]}
    >
      <Side isToggled={isToggled} isSuperChange={isSuperChange} isSuperToggled={isSuperToggled} isLeft={true}>
        {switchName[0]}
      </Side>
      <Side isToggled={!isToggled} isSuperChange={isSuperChange} isSuperToggled={isSuperToggled} isLeft={false}>
        {switchName[1]}
      </Side>
      <AnimatedBackground isToggled={isToggled} activeColor={activeColor} />
    </Container>
  )
}

const Container = styled('div')<{
  isWidth: number
  isSuperChange: boolean
  isSuperToggled: boolean
  borderColor: string
}>(({ isWidth, theme, isSuperChange, isSuperToggled, borderColor }) => ({
  display: 'flex',
  borderRadius: '6px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  border: `1px solid ${borderColor}`,
  minWidth: `${isWidth}px`,
  width: `${isWidth}px`,
  backgroundColor: '#ffffff',

  ...(isSuperChange
    ? {
        backgroundColor: isSuperToggled ? 'rgba(253, 95, 85, 1)' : '#f5f5f5',
        transition: 'background-color 0.2s ease-in-out'
      }
    : {})
}))

const AnimatedBackground = styled('div')<{ isToggled: boolean; activeColor: string[] }>(
  ({ isToggled, activeColor, theme }) => ({
    position: 'absolute',
    top: 0,
    left: isToggled ? '0%' : '50%',
    width: '50%',
    height: '100%',
    backgroundColor: isToggled ? activeColor[0] : activeColor[1],
    transition: 'left 0.2s ease-in-out',
    zIndex: 0
  })
)

const Side = styled('div')<{
  isToggled: boolean
  isSuperChange?: boolean
  isSuperToggled: boolean
  isLeft: boolean
}>(({ isToggled, isSuperChange, isSuperToggled }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  lineHeight: '1',
  padding: '5px 0',
  color: isToggled ? '#fff' : isSuperChange ? (isSuperToggled ? '#fff' : '#bdbdbd') : '#bdbdbd',
  fontSize: '12px',
  zIndex: 1
}))

export default SwitchCustom
