import { Box, Card, Grid } from '@mui/material'
import { FC } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import BarStackedChart from 'src/@core/components/charts/BarStackedChart'
import HorizontalBarChartLocation from 'src/@core/components/charts/HorizontalBarChartLocation'
import PieChart from 'src/@core/components/charts/PieChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import IconCustom from 'src/layouts/components/IconCustom'
import DashboardMenu from '../menu/DashboardMenu'

const VisitorsByHour: FC = ({}): React.ReactElement => {
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
            <HorizontalBarChartLocation />
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <PieChart />
          </Card>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorsByHour
