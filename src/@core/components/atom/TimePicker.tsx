import { Box, List, ListItem, ListItemButton, Modal } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { scrollbarSx } from './scrollbarStyles'

const TimePickerWrapper = styled.div`
  display: inline-block;
`

const TimeInputs = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

const TimeInput = styled.div`
  border: 1px solid rgba(145, 85, 253, 1);
  cursor: pointer;
  border-radius: 4px;
  min-width: 30px;
  text-align: center;
`

const modalStyle = {
  position: 'absolute' as const,
  width: 80,
  borderRadius: '5px',
  bgcolor: 'background.paper',
  border: '1px solid rgba(145, 85, 253, 1)',
  boxShadow: 24,
  maxHeight: 200, // 모달의 최대 높이
  overflowY: 'auto' // 스크롤 가능하도록 설정
}

interface ITimePicker {
  hour: number
  minute?: number
  onChange: (hour: number, minute: number) => void
}

const TimePicker: React.FC<ITimePicker> = ({ hour, minute, onChange }) => {
  const [selectedHour, setSelectedHour] = useState<number>(hour)
  const [selectedMinute, setSelectedMinute] = useState<number>(minute ?? 0)
  const [openHourModal, setOpenHourModal] = useState<boolean>(false)
  const [openMinuteModal, setOpenMinuteModal] = useState<boolean>(false)
  const [hourModalPosition, setHourModalPosition] = useState({ top: 0, left: 0 })
  const [minuteModalPosition, setMinuteModalPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    setSelectedHour(hour)
    setSelectedMinute(minute ?? 0)
  }, [hour, minute])

  const hourListRef = useRef<HTMLUListElement | null>(null)
  const minuteListRef = useRef<HTMLUListElement | null>(null)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleHourClick = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setHourModalPosition({
      top: rect.top + rect.height / 2, // TimeInput 중앙의 y 좌표
      left: rect.left + rect.width / 2 // TimeInput 중앙의 x 좌표
    })
    setOpenHourModal(true)
  }

  const handleMinuteClick = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setMinuteModalPosition({
      top: rect.top + rect.height / 2, // TimeInput 중앙의 y 좌표
      left: rect.left + rect.width / 2 // TimeInput 중앙의 x 좌표
    })
    setOpenMinuteModal(true)
  }

  const handleCloseHourModal = () => setOpenHourModal(false)
  const handleCloseMinuteModal = () => setOpenMinuteModal(false)

  useEffect(() => {
    setTimeout(() => {
      if (openHourModal && hourListRef.current) {
        const selectedElement = hourListRef.current.querySelector(`[data-value="${selectedHour}"]`)
        if (selectedElement) {
          const parentTop = hourListRef.current.getBoundingClientRect().top
          const childTop = selectedElement.getBoundingClientRect().top

          hourListRef.current.scrollTo({
            top:
              hourListRef.current.scrollTop +
              (childTop - parentTop) -
              hourListRef.current.clientHeight / 2 +
              selectedElement.clientHeight / 2,
            behavior: 'auto'
          })
        }
      }
    }, 0)
  }, [openHourModal, selectedHour])

  useEffect(() => {
    setTimeout(() => {
      if (openMinuteModal && minuteListRef.current) {
        const selectedElement = minuteListRef.current.querySelector(`[data-value="${selectedMinute}"]`)
        if (selectedElement) {
          const parentTop = minuteListRef.current.getBoundingClientRect().top
          const childTop = selectedElement.getBoundingClientRect().top

          minuteListRef.current.scrollTo({
            top:
              minuteListRef.current.scrollTop +
              (childTop - parentTop) -
              minuteListRef.current.clientHeight / 2 +
              selectedElement.clientHeight / 2,
            behavior: 'auto'
          })
        }
      }
    }, 0)
  }, [openMinuteModal, selectedMinute])

  return (
    <TimePickerWrapper>
      <TimeInputs>
        <TimeInput onClick={handleHourClick}>{selectedHour.toString().padStart(2, '0')}</TimeInput>시{' '}
        {minute ? (
          <TimeInput onClick={handleMinuteClick}>{selectedMinute.toString().padStart(2, '0')}</TimeInput>
        ) : (
          '00'
        )}
        분
      </TimeInputs>

      <Modal open={openHourModal} onClose={handleCloseHourModal}>
        <Box
          sx={{
            ...scrollbarSx,
            ...modalStyle,
            top: `${hourModalPosition.top}px`,
            left: `${hourModalPosition.left}px`,
            transform: 'translate(-50%, -50%)' // 중앙에 위치하도록 설정
          }}
          ref={hourListRef}
        >
          <List>
            {hours.map(hour => (
              <ListItem key={hour} disablePadding>
                <ListItemButton
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  selected={hour === selectedHour}
                  data-value={hour}
                  onClick={() => {
                    setSelectedHour(hour)
                    handleCloseHourModal()

                    onChange(hour, selectedMinute)
                  }}
                >
                  {hour.toString().padStart(2, '0')}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>

      <Modal open={openMinuteModal} onClose={handleCloseMinuteModal}>
        <Box
          sx={{
            ...scrollbarSx,
            ...modalStyle,
            top: `${minuteModalPosition.top}px`,
            left: `${minuteModalPosition.left}px`,
            transform: 'translate(-50%, -50%)' // 중앙에 위치하도록 설정
          }}
          ref={minuteListRef}
        >
          <List>
            {minutes.map(minute => (
              <ListItem key={minute} disablePadding>
                <ListItemButton
                  sx={{ display: 'flex', justifyContent: 'center' }}
                  selected={minute === selectedMinute}
                  data-value={minute}
                  onClick={() => {
                    setSelectedMinute(minute)
                    handleCloseMinuteModal()

                    onChange(selectedHour, minute)
                  }}
                >
                  {minute.toString().padStart(2, '0')}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </TimePickerWrapper>
  )
}

export default TimePicker
