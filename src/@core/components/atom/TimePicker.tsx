import { Box, List, ListItem, ListItemButton, Modal } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import CustomTooltip from './CustomTooltip'

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
  bgcolor: 'transparent',
  boxShadow: 'none',
  maxHeight: 200,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
}

const ListItemStyled = styled(ListItemButton)`
  display: flex;
  justify-content: center;
  transition: all 0.2s ease;
  color: rgba(0, 0, 0, 0.87);
  position: relative;
  z-index: 2;
`

const ListContainer = styled(List)`
  position: relative;
  padding: 80px 0;
  background: transparent;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.12);
    transform: translateY(-50%);
    z-index: 1;
  }
`

interface ITimePickerOnChangeRes {
  openTooltip: boolean
  tooltipText: string
  arrowPosition?: 'left' | 'center' | 'right'
}
interface ITimePicker {
  hour: number
  minute?: number
  onChange: (hour: number, minute: number) => ITimePickerOnChangeRes | void
  tooltipClear?: boolean
}

const TimePicker: React.FC<ITimePicker> = ({ hour, minute, onChange, tooltipClear }) => {
  const [selectedHour, setSelectedHour] = useState<number>(hour)
  const [selectedMinute, setSelectedMinute] = useState<number>(minute ?? 0)
  const [openHourModal, setOpenHourModal] = useState<boolean>(false)
  const [openMinuteModal, setOpenMinuteModal] = useState<boolean>(false)
  const [hourModalPosition, setHourModalPosition] = useState({ top: 0, left: 0 })
  const [minuteModalPosition, setMinuteModalPosition] = useState({ top: 0, left: 0 })
  const [tooltipInfo, setTooltipInfo] = useState<ITimePickerOnChangeRes>()

  useEffect(() => {
    setSelectedHour(hour)
    setSelectedMinute(minute ?? 0)
  }, [hour, minute])

  useEffect(() => {
    if (tooltipClear) {
      setTooltipInfo(undefined)
    }
  }, [tooltipClear])

  const hourListRef = useRef<HTMLUListElement | null>(null)
  const minuteListRef = useRef<HTMLUListElement | null>(null)

  const hours = Array.from({ length: 25 }, (_, i) => i)
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
        <CustomTooltip
          title={tooltipInfo?.tooltipText}
          placement='bottom'
          backgroundColor='rgba(58, 53, 65, 0.6)'
          color='rgba(255, 255, 255, 0.87)'
          open={tooltipInfo?.openTooltip ?? false}
          arrowPosition={tooltipInfo?.arrowPosition ?? 'center'}
        >
          <TimeInput onClick={handleHourClick}>{selectedHour.toString().padStart(2, '0')}</TimeInput>
        </CustomTooltip>
        시{' '}
        {minute ? (
          <TimeInput onClick={handleMinuteClick}>{selectedMinute.toString().padStart(2, '0')}</TimeInput>
        ) : (
          '00'
        )}
        분
      </TimeInputs>

      <Modal
        open={openHourModal}
        onClose={handleCloseHourModal}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'transparent'
            }
          }
        }}
      >
        <Box
          sx={{
            ...modalStyle,
            top: `${hourModalPosition.top}px`,
            left: `${hourModalPosition.left}px`,
            transform: 'translate(-50%, -50%)'
          }}
          ref={hourListRef}
        >
          <ListContainer>
            {hours.map(hour => (
              <ListItem key={hour} disablePadding>
                <ListItemStyled
                  selected={hour === selectedHour}
                  data-value={hour}
                  onClick={() => {
                    setSelectedHour(hour)
                    handleCloseHourModal()
                    const res = onChange(hour, selectedMinute)

                    if (res) {
                      setTooltipInfo(res)
                    }
                  }}
                >
                  {hour.toString().padStart(2, '0')}
                </ListItemStyled>
              </ListItem>
            ))}
          </ListContainer>
        </Box>
      </Modal>

      <Modal
        open={openMinuteModal}
        onClose={handleCloseMinuteModal}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'transparent'
            }
          }
        }}
      >
        <Box
          sx={{
            ...modalStyle,
            top: `${minuteModalPosition.top}px`,
            left: `${minuteModalPosition.left}px`,
            transform: 'translate(-50%, -50%)'
          }}
          ref={minuteListRef}
        >
          <ListContainer>
            {minutes.map(minute => (
              <ListItem key={minute} disablePadding>
                <ListItemStyled
                  selected={minute === selectedMinute}
                  data-value={minute}
                  onClick={() => {
                    setSelectedMinute(minute)
                    handleCloseMinuteModal()
                    onChange(selectedHour, minute)
                  }}
                >
                  {minute.toString().padStart(2, '0')}
                </ListItemStyled>
              </ListItem>
            ))}
          </ListContainer>
        </Box>
      </Modal>
    </TimePickerWrapper>
  )
}

export default TimePicker
