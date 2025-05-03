import { Box, Card, Grid } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import BarStackedChart from 'src/@core/components/charts/BarStackedChart'
import HorizontalBarChartLocation from 'src/@core/components/charts/HorizontalBarChartLocation'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import IconCustom from 'src/layouts/components/IconCustom'
import DashboardMenu from 'src/pages/dashboard/menu/DashboardMenu'

const VisitorTemplate: FC = ({}): React.ReactElement => {
  const xAxisData = ['09시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시']
  const seriesData = [
    {
      name: '교육동2층',
      data: [50, 120, 180, 200, 150, 160, 170, 140, 100]
    },
    {
      name: '식물원입구',
      data: [30, 80, 120, 150, 130, 140, 120, 100, 70]
    }
  ]

  return (
    <StandardTemplate title={'방문자수 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item sm={12} xs={12}>
          <Box sx={{ mb: 3 }}>
            <DashboardMenu
              refetch={() => {
                console.log('')
              }}
            />
          </Box>
          <DividerBar />
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={['장소별 방문자수', '2025년 2월 7일 0시 ~ 18시', '총 12 곳']}
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <BarStackedChart />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={['장소별 방문자수', '2025년 2월 7일 0시 ~ 18시', '총 12 곳']}
          />
        </Grid>
        <Grid item xs={9}>
          <Card>
            <HorizontalBarChartLocation xAxisData={xAxisData} seriesData={seriesData} />
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>{/* <PieChart /> */}</Card>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorTemplate
