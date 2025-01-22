// ** MUI Imports
import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import format from 'date-fns/format'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'
import PickersRangeIcon from 'src/@core/components/atom/PickersRangeIcon'
import { useStatistics } from 'src/hooks/useStatistics'
import IconCustom from 'src/layouts/components/IconCustom'
import ZoomOption from '../chartOptions/ZoomOption'

const ChatSelect: FC = (): React.ReactElement => {
  const statistics = useStatistics()
  const router = useRouter()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)

    return format(date, 'MM월 dd일')
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }} m={3}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PickersRangeIcon
          popperPlacement={popperPlacement}
          onChange={(start, end) => {
            statistics.setChartProps({ ...statistics.chartProps, startDate: start, endDate: end })
          }}
        />

        <ZoomOption
          onChange={(index: number) => {
            statistics.setChartProps({
              ...statistics.chartProps,
              rangeSelectorIndex: index,
              time: index === 0 ? 'hour' : index === 1 ? 'day' : 'month'
            })
          }}
        />

        {statistics.chartProps?.startDate && statistics.chartProps?.endDate && (
          <Box sx={{ ml: 5 }}>
            <Typography component='span' color={'rgba(164, 173, 251, 1)'} variant='body2'>
              차트표시범위 :
              <Typography component='span' color={'rgba(3, 31, 255, 1)'} variant='body2' ml={3}>
                {formatDate(statistics.chartProps?.startDate)} - {formatDate(statistics.chartProps?.endDate)}
              </Typography>
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }} gap={5}>
        <IconButton
          onClick={() => {
            router.push({
              pathname: 'group-config',
              query: { type: statistics.chartType }
            })
          }}
        >
          <IconCustom icon='stats-add' path='statistics' />
          <Typography>통계그룹</Typography>
        </IconButton>
        <IconButton
          onClick={() => {
            statistics.setChartProps({
              ...statistics.chartProps,
              isChartSetting: !statistics.chartProps.isChartSetting
            })
          }}
        >
          <IconCustom icon='ChartSettingIcon-Large' path='statistics' />
        </IconButton>
      </Box>
    </Box>
  )
}
export default ChatSelect
