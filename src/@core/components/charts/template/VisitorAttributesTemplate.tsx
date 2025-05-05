import { Box, Card, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'

import StackedBarChart from 'src/@core/components/charts/StackedBarChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import { IStatisticsContextReq } from 'src/context/StatisticsContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICountBarChart } from 'src/model/statistics/StatisticsModel'
import DashboardMenu from 'src/pages/dashboard/menu/DashboardMenu'
import ChartDetailSwiper from 'src/pages/dashboard/swiper/ChartDetailSwiper'

const HeatMapChart = dynamic(() => import('src/@core/components/charts/HeatMapChart'), {
  ssr: false
})

const VisitorAttributesTemplate: FC<{
  statisticsReq: IStatisticsContextReq
  barChartData?: ICountBarChart
  refetch: (req?: IStatisticsContextReq) => void
}> = ({ statisticsReq, barChartData, refetch }): React.ReactElement => {
  return (
    <StandardTemplate title={'방문자 특성 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item sm={12} xs={12}>
          <Box sx={{ mb: 3 }}>
            <DashboardMenu refetch={refetch} useAgeSelect statisticsReq={statisticsReq} />
          </Box>
          <DividerBar />
        </Grid>

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
        <Grid item xs={9.5}>
          <Card>{barChartData && <StackedBarChart containerId='visitor-chart-example' data={barChartData} />}</Card>
        </Grid>
        <Grid item xs={2.5}>
          <ChartDetailSwiper height={'430px'} />
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={['성별 및 연령별 방문자수', '2025년 2월 7일 0시 ~ 18시', '총 12 곳']}
          />
        </Grid>
        <Grid item xs={9}>
          <Card>{/* <PyramidChart /> */}</Card>
        </Grid>
        <Grid item xs={3}>
          <Card>{/* <PieChart /> */}</Card>
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={[
              '시간별, 성별 및 연령별 방문자수',
              '2025년 2월 1일 ~ 2월 15일까지 15일간 시간별, 성별, 연령별  평균 방문자수',
              '총 12 곳'
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <HeatMapChart />
          </Card>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorAttributesTemplate
