import { Box, TextField, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { statusLevelColorList } from 'src/enum/statisticsEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import ModifyActions from 'src/pages/cameras/table/ModifyActions'
import AnimatedNumber from './AnimatedNumber'
import WindowCard from './WindowCard'

interface CongestionCardProps {
  title: string
  maxCapacity: number
  currentOccupancy: number
  occupancyRate: number
  onRefresh?: () => void
  onEdit?: (newTitle: string) => void
  onDelete?: () => void
}

const CongestionCard: FC<CongestionCardProps> = ({
  title,
  maxCapacity,
  currentOccupancy,
  occupancyRate,
  onRefresh,
  onEdit,
  onDelete
}) => {
  const [prevOccupancy, setPrevOccupancy] = useState(currentOccupancy)
  const [prevOccupancyRate, setPrevOccupancyRate] = useState(occupancyRate)
  const [animatingDigits, setAnimatingDigits] = useState<boolean[]>([])
  const [animatingRateDigits, setAnimatingRateDigits] = useState<boolean[]>([])
  const [isIncreasingDigits, setIsIncreasingDigits] = useState<boolean[]>([])
  const [isIncreasingRateDigits, setIsIncreasingRateDigits] = useState<boolean[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)

  useEffect(() => {
    if (prevOccupancy !== currentOccupancy) {
      const prevDigits = formatNumber(prevOccupancy)
      const currentDigits = formatNumber(currentOccupancy)

      // 각 자릿수별로 변화 여부와 증가/감소 여부를 확인
      const newAnimatingDigits = currentDigits.map((digit, index) => digit !== prevDigits[index])
      const newIsIncreasingDigits = currentDigits.map((digit, index) => parseInt(digit) > parseInt(prevDigits[index]))

      setAnimatingDigits(newAnimatingDigits)
      setIsIncreasingDigits(newIsIncreasingDigits)
      setPrevOccupancy(currentOccupancy)

      // 애니메이션 상태 초기화
      setTimeout(() => {
        setAnimatingDigits(newAnimatingDigits.map(() => false))
      }, 300)
    }
  }, [currentOccupancy])

  useEffect(() => {
    if (prevOccupancyRate !== occupancyRate) {
      const prevDigits = formatNumber(prevOccupancyRate)
      const currentDigits = formatNumber(occupancyRate)

      // 각 자릿수별로 변화 여부와 증가/감소 여부를 확인
      const newAnimatingDigits = currentDigits.map((digit, index) => digit !== prevDigits[index])
      const newIsIncreasingDigits = currentDigits.map((digit, index) => parseInt(digit) > parseInt(prevDigits[index]))

      setAnimatingRateDigits(newAnimatingDigits)
      setIsIncreasingRateDigits(newIsIncreasingDigits)
      setPrevOccupancyRate(occupancyRate)

      // 애니메이션 상태 초기화
      setTimeout(() => {
        setAnimatingRateDigits(newAnimatingDigits.map(() => false))
      }, 300)
    }
  }, [occupancyRate])

  const formatNumber = (num: number): string[] => {
    return num.toString().padStart(3, '0').split('')
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    if (editedTitle !== title && onEdit) {
      onEdit(editedTitle)
    }
  }

  const handleTitleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleTitleBlur()
    }
  }

  return (
    <WindowCard
      title={
        isEditing ? (
          <>
            <TextField
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyPress={handleTitleKeyPress}
              autoFocus
              size='small'
              sx={{ width: '100%' }}
            />

            <ModifyActions
              isModify={isEditing}
              handleEditClick={() => {
                // updateDataItem(params.row.id, { isEdit: true })
              }}
              handleCancelClick={() => {
                // handleCancelClick(params.row.id)
              }}
              handleSaveClick={() => {
                // handleSaveClick(params.row.id)
              }}
            />
          </>
        ) : (
          title
        )
      }
      iconActions={[
        {
          icon: <IconCustom isCommon icon='reset' />,
          onClick:
            onRefresh ||
            (() => {
              console.log('새로고침')
            }),
          tooltip: '새로고침'
        },
        {
          icon: <IconCustom isCommon icon='Edit' />,
          onClick: handleEditClick,
          tooltip: '수정'
        },
        {
          icon: <IconCustom isCommon icon='DeleteOutline' />,
          onClick:
            onDelete ||
            (() => {
              console.log('삭제')
            }),
          tooltip: '삭제'
        }
      ]}
      titleAlign='center'
      headerColor='#F9FAFC'
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          background: `${statusLevelColorList[1]}80`,
          py: 10,
          '& > *': {
            py: 5
          }
        }}
      >
        <Typography>
          최대 수용인원 <b>{maxCapacity}</b>명 중
        </Typography>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
          <AnimatedNumber
            number={currentOccupancy}
            animatingDigits={animatingDigits}
            isIncreasingDigits={isIncreasingDigits}
            fontSize={'3rem'}
            padding={'0px 10px'}
            minWidth={'3.5rem'}
            backgroundColor={'#fff'}
          />
        </Box>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2}>
          <Typography>현재 점유율</Typography>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={1}>
            <AnimatedNumber
              number={occupancyRate}
              animatingDigits={animatingRateDigits}
              isIncreasingDigits={isIncreasingRateDigits}
              fontSize={'1.5rem'}
              minWidth={'1.5rem'}
              backgroundColor={statusLevelColorList[1]}

              // color={'#fff'}
            />
          </Box>
          <Typography>%</Typography>
        </Box>
      </Box>
    </WindowCard>
  )
}

export default CongestionCard
