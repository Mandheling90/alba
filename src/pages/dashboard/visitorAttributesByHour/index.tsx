import { Box, Card, Grid } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'

import HeatMapChart from 'src/@core/components/charts/HeatMapChart'
import PieChart from 'src/@core/components/charts/PieChart'
import PyramidChart from 'src/@core/components/charts/PyramidChart'
import { VisitorChartExample } from 'src/@core/components/charts/StackedBarChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import IconCustom from 'src/layouts/components/IconCustom'
import DashboardMenu from '../menu/DashboardMenu'
import ChartDetailSwiper from '../swiper/ChartDetailSwiper'

const VisitorAttributesByHour: FC = ({}): React.ReactElement => {
  return (
    <StandardTemplate title={'방문자 특성 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item sm={12} xs={12}>
          <Box sx={{ mb: 3 }}>
            <DashboardMenu
              refetch={() => {
                console.log('')
              }}
              useAgeSelect
            />
          </Box>
          <DividerBar />
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={['시간별 방문자수', '2025년 2월 7일 0시 ~ 18시', '총 12 곳']}
            marginBottom={-8}
          />
        </Grid>
        <Grid item xs={9.5}>
          <Card>
            <VisitorChartExample />
          </Card>
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
          <Card>
            <PyramidChart />
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <PieChart />
          </Card>
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

export default VisitorAttributesByHour
