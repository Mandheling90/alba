import { Card, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
import BarChart from 'src/@core/components/charts/BarChart'
import PieChart from 'src/@core/components/charts/PieChart'

import PyramidChart from 'src/@core/components/charts/PyramidChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import IconCustom from 'src/layouts/components/IconCustom'
import { useCountBarChart, useCountLineChart, useGenderAgeChart } from 'src/service/statistics/statisticsService'
import ChartDetailSwiper from '../swiper/ChartDetailSwiper'
import VisitantList from '../table/VisitantList'

const LiveDataLineChart = dynamic(() => import('src/@core/components/charts/LiveDataLineChart'), {
  ssr: false
})

const VisitorAttributes: FC = ({}): React.ReactElement => {
  const [hoveredPoint, setHoveredPoint] = useState<string>('')

  const { data: lineChart } = useCountLineChart()
  const { data: genderAgeChart } = useGenderAgeChart()
  const { data: barChart } = useCountBarChart()

  return (
    <StandardTemplate title={'방문자 특성 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={[
              '방문자수 통계',
              `${lineChart?.data?.startYear}년 ${lineChart?.data?.startMonth}월 ${lineChart?.data?.startDay}일 0시 ~ ${lineChart?.data?.endHour}시`,
              `총 ${lineChart?.data?.totalPlaceCount} 곳`
            ]}
            marginBottom={-8}
          />
        </Grid>
        <Grid item xs={9}>
          <Card>
            <LiveDataLineChart selected={1} data={lineChart?.data?.lineDataList || []} />
          </Card>
        </Grid>
        <Grid item xs={3}>
          <ChartDetailSwiper height={'430px'} />
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={[
              '장소별 방문자수',
              `${genderAgeChart?.data?.startYear}년 ${genderAgeChart?.data?.startMonth}월 ${genderAgeChart?.data?.startDay}일 0시 ~ ${genderAgeChart?.data?.endHour}시`,
              `총 ${genderAgeChart?.data?.totalPlaceCount} 곳`
            ]}
          />
        </Grid>
        <Grid item xs={9}>
          <Card>{genderAgeChart?.data && <PyramidChart data={genderAgeChart?.data} />}</Card>
        </Grid>
        <Grid item xs={3}>
          <Card>{genderAgeChart?.data && <PieChart data={genderAgeChart?.data.pieChart} />}</Card>
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={[
              '장소별 방문자수',
              `${barChart?.data?.startYear}년 ${barChart?.data?.startMonth}월 ${barChart?.data?.startDay}일 0시 ~ ${barChart?.data?.endHour}시`,
              `총 ${barChart?.data?.totalPlaceCount} 곳`
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <BarChart
              data={barChart?.data}
              onHover={category => {
                setHoveredPoint(category)
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <VisitantList
              data={barChart?.data?.barDataList || []}
              xcategories={barChart?.data?.xcategories || []}
              refetch={() => {
                console.log('refetch')
              }}
              selected={hoveredPoint}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <VisitantList
              data={barChart?.data?.exitCountList || []}
              xcategories={barChart?.data?.xcategories || []}
              refetch={() => {
                console.log('refetch')
              }}
              selected={hoveredPoint}
            />
          </Card>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorAttributes
