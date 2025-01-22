import { Box, Card, Grid, Typography } from '@mui/material'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

import EmptyMsg from 'src/@core/components/atom/EmptyMsg'
import HorizontalBarChart from 'src/@core/components/charts/HorizontalBarChart'
import SmokingChart from 'src/@core/components/charts/SmokingChart'
import VariablePieChart from 'src/@core/components/charts/VariablePieChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { selectDataColor } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { IChartProps, MBarChart, MLineChart, MPieChart, MTable } from 'src/model/statistics/StatisticsModel'
import {
  useOccupancyBarChartNav,
  useOccupancyBarSmokerChartNav,
  useOccupancyLineChart,
  useOccupancyPieChartNav,
  useOccupancyTable
} from 'src/service/statistics/statisticsService'
import { formatTimestamp } from 'src/utils/CommonUtil'
import ChartDataSelect from '../chartDataSetting/ChartDataSelect'
import ChatSelect from '../chartOptions/ChatSelect'
import ChartTable from '../table/ChartTable'

const SmokingStatistics: FC = (): React.ReactElement => {
  const statistics = useStatistics()

  const { mutateAsync: lineMutate } = useOccupancyLineChart()
  const { mutateAsync: barMutate, isLoading: barChartNavLoding } = useOccupancyBarChartNav()
  const { mutateAsync: barSmokerMutate, isLoading: barSmokerChartNavLoding } = useOccupancyBarSmokerChartNav()
  const { mutateAsync: pieMutate, isLoading: pieChartNavLoding } = useOccupancyPieChartNav()
  const { mutateAsync: tableMutate } = useOccupancyTable()

  const { isChartSetting } = statistics.chartProps

  const [line, setLine] = useState<MLineChart[]>([])
  const [table, setTable] = useState<MTable[]>([])
  const [bar, setBar] = useState<MBarChart[]>([])
  const [barSmoker, setBarSmoker] = useState<MBarChart[]>([])
  const [pie, setPie] = useState<MPieChart[]>([])

  const [reqTime, setReqTime] = useState<any>()
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  const previousSelectedIdsRef = useRef<number[]>([])
  const previousChartPropsRef = useRef<IChartProps>()

  const onSubmit = useCallback(
    async (isGroupPrm?: boolean, selectedIdsPrm?: number[]) => {
      //파라미터 체크
      const isGroup = isGroupPrm !== undefined ? isGroupPrm : statistics.chartProps.isGroup ?? true
      const selectedIds = selectedIdsPrm !== undefined ? selectedIdsPrm : statistics.selectedIds ?? []

      const hasSelectedIdsChanged = previousSelectedIdsRef.current !== selectedIds

      // const hasIsGroupChanged = previousisGroupPrmRef.current !== isGroup

      if (!statistics.chartProps.startDate && !statistics.chartProps.endDate) {
        statistics.setRequiredFields('date')

        return
      }

      if (statistics.chartProps.time && selectedIds.length > 0) {
        const chartProps = {
          startDate: statistics.chartProps.startDate,
          endDate: statistics.chartProps.endDate,
          time: statistics.chartProps.time
        }
        const req1: any = {
          params: {
            ...chartProps,
            statsIdList: selectedIds,
            groupIdList: selectedIds
          },
          isGroup: isGroup
        }

        if (req1.isGroup) {
          delete req1.params.statsIdList
        } else {
          delete req1.params.groupIdList
        }

        setReqTime(req1)
        const chartRes = await lineMutate(req1)
        const tableRes = await tableMutate(req1)

        setLine(
          chartRes.data.map(item => {
            const colorItem = statistics.selectedColorList.find(color => color.id === item.id)

            return {
              ...item,
              color: colorItem ? colorItem.color : ''
            }
          })
        )
        setTable(tableRes.data)

        statistics.setRequiredFields(null)

        // 값은 그대로인데 체크박스만 변경했을 경우
        if (
          previousChartPropsRef.current?.isGroup === isGroup &&
          previousChartPropsRef.current?.startDate === statistics.chartProps.startDate &&
          previousChartPropsRef.current?.endDate === statistics.chartProps.endDate &&
          hasSelectedIdsChanged &&
          statistics.selectedIds.length > 0 &&
          bar.length > 0 &&
          barSmoker.length > 0 &&
          pie.length > 0
        ) {
          setBar(
            bar.map(item => {
              const color = statistics.selectedIds.find(id => id === item.id)
                ? selectDataColor
                : 'rgba(115, 184, 255, 1)'

              return {
                ...item,
                color: color
              }
            })
          )

          setPie(
            pie.map(item => {
              const color = statistics.selectedIds.find(id => id === item.id) ? selectDataColor : ''

              return {
                ...item,
                color: color
              }
            })
          )
        }

        previousSelectedIdsRef.current = selectedIds
        previousChartPropsRef.current = { ...statistics.chartProps, isGroup: isGroup }
      } else {
        alert('필수값을 입력해주세요')
      }
    },
    [bar, barSmoker.length, lineMutate, pie, statistics, tableMutate]
  )

  const onSubmit2 = async (startDateTime: string, endDateTime: string) => {
    if (!reqTime || !reqTime.params) {
      console.error('reqTime 또는 params가 정의되지 않았습니다.')

      return
    }

    const req = {
      ...reqTime,
      params: {
        ...reqTime.params,
        startDateTime: startDateTime,
        endDateTime: endDateTime
      }
    }
    delete req.params.startDate
    delete req.params.endDate
    delete req.params.groupIdList

    if (req.isGroup) {
      delete req.params.statsIdList
    }

    const barRes = await barMutate(req)
    const barSmokerRes = await barSmokerMutate(req)
    const pieRes = await pieMutate(req)

    const barData = barRes.data.map(item => {
      let color

      if (req.isGroup) {
        color = statistics.selectedIds.find(id => id === item.id) ? selectDataColor : 'rgba(115, 184, 255, 1)'
      } else {
        color = item.checked ? selectDataColor : 'rgba(115, 184, 255, 1)'
      }

      return {
        ...item,
        color: color
      }
    })

    setBar(barData)

    setBarSmoker(barSmokerRes.data)
    setPie(
      pieRes.data.map(item => {
        let color

        if (req.isGroup) {
          color = statistics.selectedIds.find(id => id === item.id) ? selectDataColor : ''
        } else {
          color = item.checked ? selectDataColor : ''
        }

        return {
          ...item,
          color: color
        }
      })
    )
  }

  //초기 데이터 세팅
  useEffect(() => {
    setLine([])
    setTable([])

    setBar([])
    setBarSmoker([])
    setPie([])

    if (!statistics.groupSetting) {
      //초기로딩
      statistics.clear()
    } else {
      // 그룹설정에서 넘어왔을 경우
      if (
        statistics.chartProps.startDate &&
        statistics.chartProps.endDate &&
        statistics.chartProps.time &&
        statistics.selectedIds.length > 0
      ) {
        onSubmit()
      }
    }
    statistics.setChartType('smoking')

    setTimeout(() => {
      statistics.setGroupSetting(false)
    }, 500)

    return () => {
      statistics.setGroupSetting(false)
    }
  }, [])

  //초기 데이터 세팅
  useEffect(() => {
    // 최초로딩
    if (!initialDataLoaded && statistics.selectedIds.length > 0 && !statistics.groupSetting) {
      onSubmit()
      setInitialDataLoaded(true)
    }
  }, [statistics.selectedIds])

  const previousRangeRef = useRef<number[]>([])
  const previousisGroupPrmRef = useRef<boolean>(true)

  const previousOnSubmit2 = () => {
    const formattedDates = statistics.range.map(formatTimestamp)

    if (line[0].statsData && line[0].statsData.length === 1) {
      onSubmit2(
        statistics.chartProps.startDate.replace(/-/g, '') + '00',
        statistics.chartProps.endDate.replace(/-/g, '') + '23'
      )
    } else {
      onSubmit2(formattedDates[0], formattedDates[1])
    }
  }

  useEffect(() => {
    // `statistics.range`의 변경 여부를 확인
    const hasRangeChanged =
      previousRangeRef.current[0] !== statistics.range[0] || previousRangeRef.current[1] !== statistics.range[1]

    const hasIsGroupChanged = previousisGroupPrmRef.current !== statistics.chartProps.isGroup

    if (
      hasRangeChanged &&
      statistics.range[0] &&
      statistics.range[1] &&
      statistics.range[0] !== Infinity &&
      statistics.range[0] !== -Infinity &&
      statistics.chartProps.startDate &&
      statistics.chartProps.endDate &&
      line[0] &&
      line[1] &&
      line[0].statsData.length > 0 &&
      line[1].statsData.length > 0
    ) {
      //네비게이션 영역 조정시
      previousOnSubmit2()

      // 현재 `statistics.range`를 이전 값으로 저장
      previousRangeRef.current = statistics.range
    } else if (
      hasIsGroupChanged &&
      statistics.range[0] &&
      statistics.range[1] &&
      statistics.range[0] !== Infinity &&
      statistics.range[0] !== -Infinity &&
      statistics.chartProps.startDate &&
      statistics.chartProps.endDate &&
      line[0] &&
      line[1] &&
      line[0].statsData.length > 0 &&
      line[1].statsData.length > 0
    ) {
      //그룹 변경시
      previousOnSubmit2()
    }

    previousisGroupPrmRef.current = statistics.chartProps.isGroup
  }, [statistics.range, line])

  return (
    <StandardTemplate title={'흡연인구 통계'}>
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
                <SmokingChart
                  selected={statistics.chartProps.rangeSelectorIndex ?? 1}
                  data={line}
                  time={statistics.chartProps.time}
                />
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
                <ChartDataSelect chartType='smoking' onSubmit={onSubmit} />
              </Card>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Grid container spacing={5} pb={5}>
              <Grid item xs={7} sx={{ minHeight: '500px' }}>
                <Typography fontSize={'1.2em'} color={'rgb(51, 51, 51)'} fontWeight={'bold'} m={5}>
                  키오스크 및 모니터링 영역별 흡연자수 통계
                </Typography>

                {bar.length === 0 || barSmoker.length === 0 ? (
                  <EmptyMsg message={barChartNavLoding || barSmokerChartNavLoding ? 'Loding' : 'Loding'} />
                ) : (
                  <HorizontalBarChart mainData={bar} subData={barSmoker} />
                )}
              </Grid>
              <Grid item xs={5}>
                <Typography textAlign={'center'} fontSize={'1.2em'} color={'rgb(51, 51, 51)'} fontWeight={'bold'} m={5}>
                  키오스크 및 모니터링 영역별 흡연자수 비율
                </Typography>

                {pie.length === 0 ? (
                  <EmptyMsg message={pieChartNavLoding ? 'Loding' : 'Loding'} />
                ) : (
                  <VariablePieChart data={pie} />
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <ChartTable data={table} />
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default SmokingStatistics
