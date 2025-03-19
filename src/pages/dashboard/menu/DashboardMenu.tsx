import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { FC, useRef, useState } from 'react'
import PickersRange from 'src/@core/components/atom/PickersRange'
import TimePicker from 'src/@core/components/atom/TimePicker'
import CustomSelectCheckBox from 'src/@core/components/molecule/CustomSelectCheckBox'

import { useClients } from 'src/hooks/useClients'
import IconCustom from 'src/layouts/components/IconCustom'
import { formatNumber } from 'src/utils/CommonUtil'
import styled from 'styled-components'

interface IDashboardMenu {
  refetch: () => void
  useAgeSelect?: boolean
}

const FlexBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10
})

const DashboardMenu: FC<IDashboardMenu> = ({ refetch, useAgeSelect = false }) => {
  const theme = useTheme()
  const clients = useClients()

  // const { sort } = clients.kioskSort

  // const [labelArray, setLabelArray] = useState(
  //   clients.initialKioskList.map(item => ({ label: `${item.name}, ${item.location}`, id: item.id }))
  // )

  const [selectedValues, setSelectedValues] = useState<string[]>(['1'])
  const [selectedAgeValues, setSelectedAgeValues] = useState<string[]>(['1'])

  const [startTime, setStartTime] = useState<number[]>([0, 0])
  const [endTime, setEndTime] = useState<number[]>([23, 59])

  const handleRowUpdate = (updatedRow: { startTime: string; endTime: string }) => {
    console.log('Updated row:', updatedRow)
  }

  const row = { startTime: '', endTime: '' }

  // useEffect(() => {
  //   if (typeof clients.kioskListReq.status === 'number') {
  //     setLabelArray(
  //       clients.initialKioskList
  //         .filter(list => list.kioskStatus === clients.kioskListReq.status)
  //         .map(item => ({ label: `${item.name}, ${item.location}`, id: item.id }))
  //     )
  //   }
  // }, [clients.kioskListReq.status, clients.initialKioskList])

  const autocompleteRef = useRef<any>(null)

  const handleDateChange = (date: string) => {
    console.log('Selected date:', date)
  }

  return (
    <Box display={'flex'} alignItems={'center'} gap={5}>
      <FlexBox>
        <Typography variant='h6' fontWeight={500}>
          장소
        </Typography>

        <CustomSelectCheckBox
          width='185px'
          value={selectedValues}
          onChange={(event, newSelectedValues) => {
            setSelectedValues(newSelectedValues)
          }}
          options={[
            { key: '1', value: '1', label: '전체' },
            { key: '2', value: '2', label: '고객사명' },
            { key: '3', value: '3', label: '고객사주소' },
            { key: '4', value: '4', label: '고객사상태' }
          ]}
          renderValue={
            selectedValues.length === 0
              ? '장소 선택'
              : selectedValues.length === 1
              ? '남문'
              : `남문 외 ${selectedValues.length}곳`
          }
          renderIcone={<IconCustom isCommon icon='map' />}
          placeholder='장소 선택'
        />
      </FlexBox>

      <FlexBox>
        <Typography variant='h6' fontWeight={500}>
          통계 기간
        </Typography>
        <PickersRange
          useIcon={true}
          label={'통계기간'}
          returnFormat='yyyy-MM-dd'
          onChange={handleDateChange}
          width={280}
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

              // border: '1px solid rgba(145, 85, 253, 1)',
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
                handleRowUpdate({ ...row, startTime: formatNumber(hour) + formatNumber(minute) })
              }}
            />
            <Typography variant='inherit' sx={{ marginX: 1 }}>
              ~
            </Typography>
            <TimePicker
              hour={endTime[0]}
              onChange={(hour, minute) => {
                setEndTime([hour, minute])
                handleRowUpdate({ ...row, endTime: formatNumber(hour) + formatNumber(minute) })
              }}
            />
          </Box>
        </Box>
      </FlexBox>

      {useAgeSelect && (
        <FlexBox>
          <Typography variant='h6' fontWeight={500}>
            연령대
          </Typography>

          <CustomSelectCheckBox
            width='185px'
            value={selectedAgeValues}
            onChange={(event, newSelectedValues) => {
              setSelectedAgeValues(newSelectedValues)
            }}
            options={[
              { key: '1', value: '1', label: '10대' },
              { key: '2', value: '2', label: '20대' },
              { key: '3', value: '3', label: '30대' },
              { key: '4', value: '4', label: '40대' },
              { key: '5', value: '5', label: '50대' },
              { key: '6', value: '6', label: '60대 이상' }
            ]}
            renderValue={selectedAgeValues.join(', ') ?? '연령대 선택'}
            renderIcone={<IconCustom isCommon icon='map' />}
            placeholder='연령대 선택'
          />
        </FlexBox>
      )}

      <FlexBox>
        <Button
          sx={{ ml: 5 }}
          variant={'contained'}
          onClick={() => {
            // contents.setContentListReqPram({ ...contents.contentListReqPram, ...reqPram })
          }}
        >
          검색
        </Button>
      </FlexBox>
    </Box>
  )
}

export default DashboardMenu
