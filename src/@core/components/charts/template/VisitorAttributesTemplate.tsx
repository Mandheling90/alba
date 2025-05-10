import { Box, Button, Card, Grid, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'

import StackedBarChart from 'src/@core/components/charts/StackedBarChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { ETableDisplayType, ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { useStatistics } from 'src/hooks/useStatistics'
import IconCustom from 'src/layouts/components/IconCustom'
import {
  IAgeGenderStatisticsTableResponse,
  ICountBarChart,
  IHeatMapChart,
  IPyramidPieChart
} from 'src/model/statistics/StatisticsModel'
import DashboardMenu from 'src/pages/dashboard/menu/DashboardMenu'
import ChartDetailSwiper from 'src/pages/dashboard/swiper/ChartDetailSwiper'
import { exportToExcel } from 'src/utils/CommonUtil'
import VisitorAttributesDepthTable from '../../table/depthTable/VisitorAttributesDepthTable'
import PieChart from '../PieChart'
import PyramidChart from '../PyramidChart'

const HeatMapChart = dynamic(() => import('src/@core/components/charts/HeatMapChart'), {
  ssr: false
})

const VisitorAttributesTemplate: FC<{
  statisticsReq: IStatisticsContextReq
  barChartData?: ICountBarChart
  pyramidPieChartData?: IPyramidPieChart
  heatmapChartData?: IHeatMapChart
  tableData?: IAgeGenderStatisticsTableResponse
  refetch: (req?: IStatisticsContextReq) => void
}> = ({
  statisticsReq,
  barChartData,
  pyramidPieChartData,
  heatmapChartData,
  tableData,
  refetch
}): React.ReactElement => {
  const [tableDisplayType, setTableDisplayType] = useState<ETableDisplayType>(
    statisticsReq.tableDisplayType ?? ETableDisplayType.TIME_PLACE
  )
  const { statisticsReqUpdate } = useStatistics()

  return (
    <StandardTemplate title={'방문자 특성 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item sm={12} xs={12}>
          <Box sx={{ mb: 3 }}>
            <DashboardMenu refetch={refetch} useAgeSelect statisticsReq={statisticsReq} />
          </Box>
          <DividerBar />
        </Grid>
        {barChartData && (
          <>
            <Grid item xs={12}>
              <PipelineTitle
                Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
                title={[
                  '시간별 방문자수',
                  `${barChartData?.startYear}년 ${barChartData?.startMonth}월 ${barChartData?.startDay}일 ${barChartData?.startHour}시 ~ ${barChartData?.endYear}년 ${barChartData?.endMonth}월 ${barChartData?.endDay}일 ${barChartData?.endHour}시`,
                  `총 ${barChartData?.totalPlaceCount} 곳`
                ]}
                marginBottom={-8}
              />
            </Grid>
            <Grid item xs={9}>
              <Card>{barChartData && <StackedBarChart containerId='visitor-chart-example' data={barChartData} />}</Card>
            </Grid>
            <Grid item xs={3}>
              <ChartDetailSwiper height={'430px'} />
            </Grid>
          </>
        )}

        {pyramidPieChartData && (
          <>
            <Grid item xs={12}>
              <PipelineTitle
                Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
                title={[
                  '성별 및 연령별 방문자수',
                  `${pyramidPieChartData?.startYear}년 ${pyramidPieChartData?.startMonth}월 ${pyramidPieChartData?.startDay}일 ${pyramidPieChartData?.startHour}시 ~ ${pyramidPieChartData?.endYear}년 ${pyramidPieChartData?.endMonth}월 ${pyramidPieChartData?.endDay}일 ${pyramidPieChartData?.endHour}시`,
                  `총 ${pyramidPieChartData?.totalPlaceCount} 곳`
                ]}
              />
            </Grid>
            <Grid item xs={9}>
              <Card>
                <PyramidChart data={pyramidPieChartData} />
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card>
                <PieChart data={pyramidPieChartData.pieChart} />
              </Card>
            </Grid>
          </>
        )}

        {heatmapChartData && (
          <>
            <Grid item xs={12}>
              <PipelineTitle
                Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
                title={[
                  '시간별, 성별 및 연령별 방문자수',
                  `${heatmapChartData?.startYear}년 ${heatmapChartData?.startMonth}월 ${heatmapChartData?.startDay}일 ~ ${heatmapChartData?.endYear}년 ${heatmapChartData?.endMonth}월 ${heatmapChartData?.endDay}일`,
                  `총 ${heatmapChartData?.totalPlaceCount} 곳`
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <HeatMapChart data={heatmapChartData} />
              </Card>
            </Grid>
          </>
        )}

        {tableData && (
          <>
            <Grid item xs={12}>
              <HorizontalScrollBox>
                <Box sx={{ minWidth: 'fit-content' }}>
                  <PipelineTitle
                    Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
                    title={[
                      '장소별 방문자수',
                      `${tableData?.startYear}년 ${tableData?.startMonth}월 ${tableData?.startDay}일 ${tableData?.startHour}시 ~ ${tableData?.endYear}년 ${tableData?.endMonth}월 ${tableData?.endDay}일 ${tableData?.endHour}시`,
                      `총 ${tableData?.totalPlaceCount} 곳`
                    ]}
                  />
                </Box>

                <Box sx={{ minWidth: 'fit-content', mx: 'auto' }}>
                  <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap' }}>
                    남성 전체
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
                      {tableData?.totalManCount}
                    </Typography>
                    명 | 여성 전체
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
                      {tableData?.totalWomanCount}
                    </Typography>
                    명
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 'fit-content' }}>
                  <Box display='flex' gap={2}>
                    {statisticsReq.tableType !== ETableType.WEEKDAY &&
                      statisticsReq.tableType !== ETableType.WEEKLY && (
                        <>
                          <Button
                            variant={tableDisplayType === ETableDisplayType.TIME ? 'contained' : 'outlined'}
                            color='primary'
                            onClick={() => {
                              setTableDisplayType(ETableDisplayType.TIME)
                              statisticsReqUpdate({
                                ...statisticsReq,
                                tableDisplayType: ETableDisplayType.TIME
                              })
                            }}
                          >
                            시간대별
                          </Button>
                          <Button
                            variant={tableDisplayType === 'timePlace' ? 'contained' : 'outlined'}
                            color='primary'
                            onClick={() => {
                              setTableDisplayType(ETableDisplayType.TIME_PLACE)
                              statisticsReqUpdate({
                                ...statisticsReq,
                                tableDisplayType: ETableDisplayType.TIME_PLACE
                              })
                            }}
                          >
                            시간대 및 장소별
                          </Button>
                        </>
                      )}

                    <Button
                      startIcon={<IconCustom isCommon icon='downLoad2' />}
                      variant='outlined'
                      color='primary'
                      onClick={() => {
                        if (tableData) {
                          const fileName = `방문자수_통계_${tableData.startYear}${tableData.startMonth}${tableData.startDay}`
                          exportToExcel(tableData.dataList, fileName)
                        }
                      }}
                    >
                      다운로드
                    </Button>
                  </Box>
                </Box>
              </HorizontalScrollBox>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <VisitorAttributesDepthTable
                  tableDisplayType={tableDisplayType}
                  tableType={statisticsReq.tableType ?? ETableType.HOURLY}
                  data={tableData}
                />
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorAttributesTemplate
