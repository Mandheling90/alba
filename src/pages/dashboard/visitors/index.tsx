import { Card, Grid } from '@mui/material'
import { FC } from 'react'
import BarChart from 'src/@core/components/charts/BarChart'
import { LiveDataLineChartExample } from 'src/@core/components/charts/LiveDataLineChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import IconCustom from 'src/layouts/components/IconCustom'
import { exampleMVisitant } from 'src/model/dashboard/dashboard'
import ChartDetailSwiper from '../swiper/ChartDetailSwiper'
import VisitantList from '../table/VisitantList'

const Visitors: FC = ({}): React.ReactElement => {
  return (
    <StandardTemplate title={'방문자수 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={['방문자수 통계', '2025년 2월 7일 0시 ~ 18시', '총 12 곳']}
            marginBottom={-8}
          />
        </Grid>
        <Grid item xs={9.5}>
          <Card>
            <LiveDataLineChartExample />
          </Card>
        </Grid>
        <Grid item xs={2.5}>
          <ChartDetailSwiper height={'430px'} />
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={['장소별 방문자수', '2025년 2월 7일 0시 ~ 18시', '총 12 곳']}
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <BarChart />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <VisitantList
              data={exampleMVisitant}
              refetch={() => {
                console.log('refetch')
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <VisitantList
              data={exampleMVisitant}
              refetch={() => {
                console.log('refetch')
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default Visitors
