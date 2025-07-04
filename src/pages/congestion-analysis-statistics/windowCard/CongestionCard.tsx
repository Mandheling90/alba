import { Box, IconButton, TextField, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import { StyledTextField } from 'src/@core/styles/StyledComponents'
import { statusLevelColorList } from 'src/enum/statisticsEnum'
import { useModal } from 'src/hooks/useModal'
import IconCustom from 'src/layouts/components/IconCustom'
import { IAreaStatsDtoList } from 'src/model/statistics/StatisticsModel'
import styled from 'styled-components'
import AnimatedNumber from './AnimatedNumber'
import WindowCard from './WindowCard'

interface CongestionCardProps {
  data: IAreaStatsDtoList
  onRefresh?: (areaId: number) => void
  onDelete?: () => void
  onEdit?: (areaId: number, areaName: string, maxCapacity: number) => void
}

const CongestionCard: FC<CongestionCardProps> = ({ data, onRefresh, onDelete, onEdit }) => {
  const { setSimpleDialogModalProps } = useModal()

  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(data.areaName)
  const [editedMaxCapacity, setEditedMaxCapacity] = useState(data.maxCapacity.toString())

  const [currentData, setCurrentData] = useState({
    currentOccupancy: data.areaCount,
    occupancyRate: data.occupancyRate
  })

  useEffect(() => {
    setCurrentData({
      currentOccupancy: data.areaCount,
      occupancyRate: data.occupancyRate
    })
  }, [data])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value)
  }

  const handleMaxCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (/^\d*$/.test(value)) {
      setEditedMaxCapacity(value)
    }
  }

  const [isRefreshOpen, setIsRefreshOpen] = useState(false)

  return (
    <WindowCard
      title={
        isEditing ? (
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={3}>
            <TextField value={editedTitle} onChange={handleTitleChange} autoFocus size='small' sx={{ flex: 1 }} />

            <Box display={'flex'} justifyContent={'flex-end'} gap={2} sx={{ width: 'auto' }}>
              <CustomAddCancelButton
                text={['적용', '취소']}
                onCancelClick={() => {
                  setIsEditing(false)

                  // setSimpleDialogModalProps({
                  //   open: true,
                  //   size: 'small',
                  //   title: '취소 확인',
                  //   contents: `저장되지 않은 모든 정보가 삭제됩니다. \r\n 정말 취소하시겠습니까?`,
                  //   isConfirm: true,
                  //   confirmFn: () => {
                  //     setIsEditing(false)
                  //   }
                  // })
                }}
                onSaveClick={() => {
                  if (editedTitle === '' || editedMaxCapacity === '' || Number(editedMaxCapacity) <= 0) {
                    setSimpleDialogModalProps({
                      open: true,
                      title: <CustomModalTitle>시설 정보 저장 오류</CustomModalTitle>,
                      contents: `필수 입력 항목인 '시설명' 입력 후 중복확인이 되어야 하고,  '최대수용인원수'가 입력되어야 하며, 최소 한개 이상의 영역이 추가되어야 시설정보가 저장될 수 있습니다.`
                    })
                  } else {
                    onEdit?.(data.areaId, editedTitle, Number(editedMaxCapacity))
                    setIsEditing(false)
                  }
                }}
              />
            </Box>
          </Box>
        ) : (
          data.areaName
        )
      }
      iconActions={
        isEditing
          ? []
          : [
              {
                icon: (
                  <CustomTooltip
                    title='카운터가 리셋되었습니다'
                    open={isRefreshOpen}
                    placement='bottom'
                    isToast
                    onClose={() => setIsRefreshOpen(false)}
                  >
                    <IconButton
                      size='small'
                      onClick={() => {
                        onRefresh?.(data.areaId)
                        setIsRefreshOpen(true)
                      }}
                      title='새로고침'
                      sx={{
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <IconCustom isCommon icon='reset' style={{ width: '20px' }} />
                    </IconButton>
                  </CustomTooltip>
                )
              },
              {
                icon: (
                  <IconButton
                    size='small'
                    onClick={handleEditClick}
                    title='수정'
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <IconCustom isCommon icon='Edit' style={{ width: '20px' }} />
                  </IconButton>
                )
              },
              {
                icon: (
                  <IconButton
                    size='small'
                    onClick={() => {
                      setSimpleDialogModalProps({
                        open: true,
                        title: '시설정보 삭제 확인',
                        contents: `선택하신 시설 정보를 정말 삭제하시겠습니까? \r\n 삭제 시 시설 정보 및 시설 관련 통계 데이터 모두 삭제됩니다.`,
                        isConfirm: true,
                        confirmFn: () => {
                          if (onDelete) {
                            onDelete()
                          }
                          setTimeout(() => {
                            setSimpleDialogModalProps({
                              open: true,
                              size: 'small',
                              title: '시설정보 삭제 확인',
                              contents: `선택하신 시설 정보가 삭제되었습니다.`
                            })
                          }, 100)
                        }
                      })
                    }}
                    title='삭제'
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {' '}
                    <IconCustom isCommon icon='DeleteOutline' style={{ width: '20px' }} />{' '}
                  </IconButton>
                )
              }
            ]
      }
      titleAlign='center'
      headerColor='#F9FAFC'
      isRefreshOpen={isRefreshOpen}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          background: `${statusLevelColorList[data.alarmLevel - 1]}50`,
          py: 10,
          '& > *': {
            py: 4
          }
        }}
      >
        <Typography>
          최대 수용인원{' '}
          {isEditing ? (
            <StyledTextField
              value={editedMaxCapacity}
              onChange={handleMaxCapacityChange}
              size='small'
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
            />
          ) : (
            <b>{data.maxCapacity}</b>
          )}
          명 중
        </Typography>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={3}
          sx={{ opacity: `${isEditing ? '0.1' : ''}` }}
        >
          <AnimatedNumber
            number={currentData.currentOccupancy}
            fontSize={'3rem'}
            padding={'0px 10px'}
            minWidth={'3.5rem'}
            backgroundColor={'#fff'}
          />
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={2}
          sx={{ opacity: `${isEditing ? '0.1' : ''}` }}
        >
          <Typography>현재 점유율</Typography>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={1}>
            <AnimatedNumber
              number={currentData.occupancyRate}
              fontSize={'1.5rem'}
              minWidth={'1.8rem'}
              backgroundColor={statusLevelColorList[data.alarmLevel - 1]}
              color={data.alarmLevel === 4 ? '#fff' : ''}
            />
          </Box>
          <Typography>%</Typography>
        </Box>
      </Box>
    </WindowCard>
  )
}

const CustomModalTitle = styled.span`
  display: inline-block;
  font-size: 20px;
  color: #5e5b65;
  margin: 0 auto;
  font-weight: 600;
  padding-left: 30px;
  min-height: 24px;
  background: center left / 24px url('/images/caution/ALM0000005.svg') no-repeat;
`

export default CongestionCard
