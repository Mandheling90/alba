import { Box, Card, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'

import StackedBarChart from 'src/@core/components/charts/StackedBarChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import { IStatisticsContextReq } from 'src/context/StatisticsContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICountBarChart, IHeatMapChart, IPyramidPieChart } from 'src/model/statistics/StatisticsModel'
import DashboardMenu from 'src/pages/dashboard/menu/DashboardMenu'
import ChartDetailSwiper from 'src/pages/dashboard/swiper/ChartDetailSwiper'
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
  refetch: (req?: IStatisticsContextReq) => void
}> = ({ statisticsReq, barChartData, pyramidPieChartData, heatmapChartData, refetch }): React.ReactElement => {
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
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorAttributesTemplate
