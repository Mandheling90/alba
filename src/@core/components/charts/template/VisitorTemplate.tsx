import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { FC, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import BarStackedChart from 'src/@core/components/charts/BarStackedChart'
import HorizontalBarChartLocation from 'src/@core/components/charts/HorizontalBarChartLocation'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import { IStatisticsContextReq } from 'src/context/StatisticsContext'
import { useStatistics } from 'src/hooks/useStatistics'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICountBarChart, ICountBarPieChart, ICountBarTable } from 'src/model/statistics/StatisticsModel'
import DashboardMenu from 'src/pages/dashboard/menu/DashboardMenu'
import { exportToExcel } from 'src/utils/CommonUtil'
import DepthTable from '../../table/depthTable/DepthTable'
import PieChart from '../PieChart'

const VisitorTemplate: FC<{
  statisticsReq: IStatisticsContextReq
  refetch: (req?: IStatisticsContextReq) => void
  barChartData?: ICountBarChart
  barPieChartData?: ICountBarPieChart
  barTableData?: ICountBarTable
}> = ({ statisticsReq, refetch, barChartData, barPieChartData, barTableData }): React.ReactElement => {
  const [tableDisplayType, setTableDisplayType] = useState<'time' | 'timePlace'>(
    statisticsReq.tableDisplayType ?? 'timePlace'
  )
  const { statisticsReqUpdate } = useStatistics()

  return (
    <StandardTemplate title={'방문자수 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item sm={12} xs={12}>
          <Box sx={{ mb: 3 }}>
            <DashboardMenu statisticsReq={statisticsReq} refetch={refetch} />
          </Box>
          <DividerBar />
        </Grid>

        {barChartData && (
          <>
            <Grid item xs={12}>
              <PipelineTitle
                Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
                title={[
                  '장소별 방문자수',
                  `${barChartData?.startYear}년 ${barChartData?.startMonth}월 ${barChartData?.startDay}일 ${barChartData?.startHour}시 ~ ${barChartData?.endYear}년 ${barChartData?.endMonth}월 ${barChartData?.endDay}일 ${barChartData?.endHour}시`,
                  `총 ${barChartData?.totalPlaceCount} 곳`
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <Card>
                <BarStackedChart data={barChartData} />
              </Card>
            </Grid>
          </>
        )}

        {barPieChartData && (
          <>
            <Grid item xs={12}>
              <PipelineTitle
                Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
                title={[
                  '장소별 방문자수',
                  `${barPieChartData?.startYear}년 ${barPieChartData?.startMonth}월 ${barPieChartData?.startDay}일 ${barPieChartData?.startHour}시 ~ ${barPieChartData?.endYear}년 ${barPieChartData?.endMonth}월 ${barPieChartData?.endDay}일 ${barPieChartData?.endHour}시`,
                  `총 ${barPieChartData?.totalPlaceCount} 곳`
                ]}
              />
            </Grid>
            <Grid item xs={9}>
              <Card>{barPieChartData && <HorizontalBarChartLocation data={barPieChartData.barChart} />}</Card>
            </Grid>
            <Grid item xs={3}>
              <Card> {barPieChartData && <PieChart data={barPieChartData.pieChart} />} </Card>
            </Grid>
          </>
        )}

        {barTableData && (
          <>
            <Grid item xs={12}>
              <Box display='flex' alignItems='center' width='100%'>
                <Box flex={1}>
                  <PipelineTitle
                    Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
                    title={[
                      '장소별 방문자수',
                      `${barTableData?.startYear}년 ${barTableData?.startMonth}월 ${barTableData?.startDay}일 ${barTableData?.startHour}시 ~ ${barTableData?.endYear}년 ${barTableData?.endMonth}월 ${barTableData?.endDay}일 ${barTableData?.endHour}시`,
                      `총 ${barTableData?.totalPlaceCount} 곳`
                    ]}
                  />
                </Box>

                <Box flex={1} display='flex' justifyContent='center'>
                  <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    전체 입장객 수
                    <Typography
                      component='span'
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        border: '1px solid rgba(58, 53, 65, 0.87)',
                        borderRadius: '5px',
                        padding: '2px'
                      }}
                    >
                      {barTableData?.totalInCount}
                    </Typography>
                    명 | 전체 퇴장객 수
                    <Typography
                      component='span'
                      sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        border: '1px solid rgba(58, 53, 65, 0.87)',
                        borderRadius: '5px',
                        padding: '2px'
                      }}
                    >
                      {barTableData?.totalOutCount}
                    </Typography>
                    명
                  </Typography>
                </Box>

                <Box flex={1} display='flex' justifyContent='flex-end'>
                  <Box display='flex' gap={2}>
                    <Button
                      variant={tableDisplayType === 'time' ? 'contained' : 'outlined'}
                      color='primary'
                      onClick={() => {
                        setTableDisplayType('time')
                        statisticsReqUpdate({
                          ...statisticsReq,
                          tableDisplayType: 'time'
                        })
                      }}
                    >
                      시간대별
                    </Button>
                    <Button
                      variant={tableDisplayType === 'timePlace' ? 'contained' : 'outlined'}
                      color='primary'
                      onClick={() => {
                        setTableDisplayType('timePlace')
                        statisticsReqUpdate({
                          ...statisticsReq,
                          tableDisplayType: 'timePlace'
                        })
                      }}
                    >
                      시간대 및 장소별
                    </Button>
                    <Button
                      startIcon={<IconCustom isCommon icon='download2' />}
                      variant='outlined'
                      color='primary'
                      onClick={() => {
                        if (barTableData) {
                          const fileName = `방문자수_통계_${barTableData.startYear}${barTableData.startMonth}${barTableData.startDay}`
                          exportToExcel(barTableData.dataList, fileName)
                        }
                      }}
                    >
                      다운로드
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <DepthTable
                  tableDisplayType={tableDisplayType}
                  tableType={statisticsReq.tableType ?? 'hourly'}
                  data={barTableData}
                />
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorTemplate
