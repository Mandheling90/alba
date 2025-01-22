import { Box, Card, Grid } from '@mui/material'
import { FC, useEffect, useState } from 'react'

import CrowdChart from 'src/@core/components/charts/CrowdChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useStatistics } from 'src/hooks/useStatistics'
import { MLineChart, MTable } from 'src/model/statistics/StatisticsModel'
import { useTripwireLineChart, useTripwireTable } from 'src/service/statistics/statisticsService'
import ChartDataSelect from '../chartDataSetting/ChartDataSelect'
import ChatSelect from '../chartOptions/ChatSelect'
import ChartTable from '../table/ChartTable'

const CrowdStatistics: FC = (): React.ReactElement => {
  const statistics = useStatistics()

  const { mutateAsync: lineMutate } = useTripwireLineChart()
  const { mutateAsync: tableMutate } = useTripwireTable()

  const [line, setLine] = useState<MLineChart[]>([])
  const [table, setTable] = useState<MTable[]>([])

  const onSubmit = async () => {
    if (
      statistics.chartProps.startDate &&
      statistics.chartProps.endDate &&
      statistics.chartProps.time &&
      statistics.selectedIds.length > 0
    ) {
      const req: any = {
        params: {
          startDate: statistics.chartProps.startDate,
          endDate: statistics.chartProps.endDate,
          statsIdList: statistics.selectedIds,
          groupIdList: statistics.selectedIds,
          time: statistics.chartProps.time
        },
        isGroup: statistics.chartProps.isGroup ?? true
      }

      if (req.isGroup) {
        delete req.params.statsIdList
      } else {
        delete req.params.groupIdList
      }

      const chartRes = await lineMutate(req)
      const tableRes = await tableMutate(req)

      const mergedData = chartRes.data.map(item => {
        const colorItem = statistics.selectedColorList.find(color => color.id === item.id)

        return {
          ...item,
          color: colorItem ? colorItem.color : ''
        }
      })
      setLine(mergedData)
      setTable(tableRes.data)
    } else {
      alert('필수값을 입력해주세요')
    }
  }

  // useEffect(() => {
  //   if (statistics.selectedIds.length > 0 && line.length > 0) {
  //     onSubmit()
  //   }
  // }, [statistics.chartProps.startDate, statistics.chartProps.endDate, statistics.chartProps.time])

  useEffect(() => {
    if (!statistics.groupSetting) {
      statistics.clear()
    } else {
      if (
        statistics.chartProps.startDate &&
        statistics.chartProps.endDate &&
        statistics.chartProps.time &&
        statistics.selectedIds.length > 0
      ) {
        onSubmit()
      }
    }
    statistics.setChartType('crowd')

    setTimeout(() => {
      statistics.setGroupSetting(false)
    }, 500)

    return () => {
      statistics.setGroupSetting(false)
    }
  }, [])

  const { isChartSetting } = statistics.chartProps

  // useEffect(() => {
  //   console.log(statistics.range)
  //   console.log(table)
  // }, [statistics.range])

  return (
    <StandardTemplate title={'유동인구 통계'}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'stretch', minHeight: '495px' }}>
            <Box
              sx={{
                flexGrow: 1,
                width: isChartSetting ? '75%' : '100%',
                transition: 'width 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Card sx={{ height: '100%' }}>
                {/* 차트 옵션 */}
                <ChatSelect />
                {line.length > 0 && <CrowdChart selected={statistics.chartProps.rangeSelectorIndex ?? 1} data={line} />}
              </Card>
            </Box>

            <Box
              sx={{
                width: '25%',
                paddingLeft: 2,
                display: isChartSetting ? 'flex' : 'none',
                flexDirection: 'column'
              }}
            >
              <Card sx={{ height: '100%' }}>
                {/* 추가적인 차트 설정 컴포넌트 */}
                <ChartDataSelect onSubmit={onSubmit} chartType='crowd' />
              </Card>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <ChartTable data={table} isCrowd />
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default CrowdStatistics
