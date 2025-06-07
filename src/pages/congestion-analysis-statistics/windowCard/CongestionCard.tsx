import { Box, TextField, Typography } from '@mui/material'
import { FC, useState } from 'react'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import { statusLevelColorList } from 'src/enum/statisticsEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import AnimatedNumber from './AnimatedNumber'
import WindowCard from './WindowCard'

interface CongestionCardProps {
  title: string
  maxCapacity: number
  currentOccupancy: number
  occupancyRate: number
  onRefresh?: () => void
  onDelete?: () => void
}

const CongestionCard: FC<CongestionCardProps> = ({
  title,
  maxCapacity,
  currentOccupancy,
  occupancyRate,
  onRefresh,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [editedMaxCapacity, setEditedMaxCapacity] = useState(maxCapacity.toString())
  const [currentData, setCurrentData] = useState({
    currentOccupancy,
    occupancyRate
  })

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

  return (
    <WindowCard
      title={
        isEditing ? (
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={3}>
            <TextField value={editedTitle} onChange={handleTitleChange} autoFocus size='small' sx={{ width: '75%' }} />

            <Box display={'flex'} justifyContent={'center'} gap={2} sx={{ width: '25%' }}>
              <CustomAddCancelButton
                text={['적용', '취소']}
                onCancelClick={() => {
                  setIsEditing(false)
                }}
                onSaveClick={() => {
                  console.log('1')
                }}
              />
            </Box>
          </Box>
        ) : (
          title
        )
      }
      iconActions={
        isEditing
          ? []
          : [
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
            ]
      }
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
          최대 수용인원{' '}
          {isEditing ? (
            <TextField
              value={editedMaxCapacity}
              onChange={handleMaxCapacityChange}
              size='small'
              sx={{
                width: '40px',
                '& input': {
                  textAlign: 'center',
                  padding: '2px 4px',
                  fontSize: 'inherit'
                },
                '& .MuiOutlinedInput-root': {
                  height: '24px'
                }
              }}
            />
          ) : (
            <b>{maxCapacity}</b>
          )}
          명 중
        </Typography>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={3}>
          <AnimatedNumber
            number={currentData.currentOccupancy}
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
              number={currentData.occupancyRate}
              fontSize={'1.5rem'}
              minWidth={'1.5rem'}
              backgroundColor={statusLevelColorList[1]}
            />
          </Box>
          <Typography>%</Typography>
        </Box>
      </Box>
    </WindowCard>
  )
}

export default CongestionCard
