import { Box, Button, Typography } from '@mui/material'
import { FC, useState } from 'react'
import PickersRange from 'src/@core/components/atom/PickersRange'
import TimePicker from 'src/@core/components/atom/TimePicker'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { IStatisticsContextReq } from 'src/context/StatisticsContext'
import IconCustom from 'src/layouts/components/IconCustom'
import AgeSelect from 'src/pages/dashboard/menu/AgeSelect'
import CameraGroupSelect from 'src/pages/dashboard/menu/CameraGroupSelect'
import styled from 'styled-components'

interface IDashboardMenu {
  refetch: (req?: IStatisticsContextReq) => void
  useAgeSelect?: boolean
  statisticsReq: IStatisticsContextReq
}

const FlexBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexShrink: 0
})

const DashboardMenu: FC<IDashboardMenu> = ({ refetch, useAgeSelect = false, statisticsReq }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([
    ...(Array.isArray(statisticsReq.cameraNos) ? statisticsReq.cameraNos.map(String) : []),
    ...(Array.isArray(statisticsReq.cameraGroupIds) ? statisticsReq.cameraGroupIds.map(String) : [])
  ])

  const [cameraNos, setCameraNos] = useState<number[]>(
    Array.isArray(statisticsReq.cameraNos) ? statisticsReq.cameraNos : []
  )
  const [cameraGroupIds, setCameraGroupIds] = useState<number[]>(
    Array.isArray(statisticsReq.cameraGroupIds) ? statisticsReq.cameraGroupIds : []
  )

  const [dateRange, setDateRange] = useState<[string, string]>([
    statisticsReq.startDate ?? '',
    statisticsReq.endDate ?? ''
  ])

  const [startTime, setStartTime] = useState<number[]>([Number(statisticsReq.startTime ?? '0'), 0])
  const [endTime, setEndTime] = useState<number[]>([Number(statisticsReq.endTime ?? '24'), 59])

  const [selectedAgeValues, setSelectedAgeValues] = useState<string[]>(
    statisticsReq.ageType ? statisticsReq.ageType.split(',').map(value => value.trim()) : ['ALL']
  )

  const handleCameraChange = (cameraNos: number[], cameraGroupIds: number[]) => {
    setSelectedValues([...cameraNos.map(String), ...cameraGroupIds.map(String)])
    setCameraNos(cameraNos)
    setCameraGroupIds(cameraGroupIds)
  }

  const handleDateChange = (start: string, end: string) => {
    setDateRange([start, end])
  }

  const handleAgeChange = (values: string[]) => {
    setSelectedAgeValues(values)
  }

  return (
    <HorizontalScrollBox>
      <CameraGroupSelect value={selectedValues} onChange={handleCameraChange} />

      <FlexBox>
        <Typography variant='h6' fontWeight={500}>
          통계 기간
        </Typography>
        <PickersRange
          useIcon={true}
          label={'통계기간'}
          returnFormat='yyyy-MM-dd'
          onChange={handleDateChange}
          selectedStartDate={dateRange[0]}
          selectedEndDate={dateRange[1]}
          width={280}
          alwaysShowIcon
          clearable={false}
          showTwoCalendars
        />
      </FlexBox>

      <FlexBox>
        <Typography variant='h6' fontWeight={500}>
          시간 범위
        </Typography>
        <Box display={'flex'} alignItems={'center'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #C7C7C8',
              p: 1.5,
              pl: 2,
              pr: 2,
              borderRadius: 1
            }}
          >
            <Box display={'flex'} alignItems={'center'} mr={2}>
              <IconCustom isCommon icon='time' />
            </Box>

            <TimePicker
              hour={startTime[0]}
              onChange={(hour, minute) => {
                setStartTime([hour, minute])

                return {
                  openTooltip: hour > endTime[0],
                  tooltipText: '시작 시간은 끝시간 이전이어야 합니다.',
                  arrowPosition: 'left'
                }
              }}
              tooltipClear={startTime[0] < endTime[0]}
            />
            <Typography variant='inherit' sx={{ marginX: 1 }}>
              ~
            </Typography>

            <Box>
              <TimePicker
                hour={endTime[0]}
                onChange={(hour, minute) => {
                  setEndTime([hour, minute])

                  return {
                    openTooltip: hour < startTime[0],
                    tooltipText: '끝 시간은 시작 시간 이후여야 합니다.',
                    arrowPosition: 'right'
                  }
                }}
                tooltipClear={startTime[0] < endTime[0]}
              />
            </Box>
          </Box>
        </Box>
      </FlexBox>

      {useAgeSelect && <AgeSelect value={selectedAgeValues} onChange={handleAgeChange} />}

      <FlexBox>
        <Button
          sx={{ ml: 5 }}
          variant={'contained'}
          onClick={() => {
            refetch({
              ...statisticsReq,
              cameraNos,
              cameraGroupIds,
              startDate: dateRange[0],
              endDate: dateRange[1],
              startTime: startTime[0].toString().padStart(2, '0'),
              endTime: endTime[0].toString().padStart(2, '0'),
              ageType: selectedAgeValues.join(',')
            })
          }}
        >
          검색
        </Button>
      </FlexBox>
    </HorizontalScrollBox>
  )
}

export default DashboardMenu
