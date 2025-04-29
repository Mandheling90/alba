import { Card, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState } from 'react'
import BarChart from 'src/@core/components/charts/BarChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import IconCustom from 'src/layouts/components/IconCustom'
import { useCountBarChart } from 'src/service/statistics/statisticsService'
import ChartDetailSwiper from '../swiper/ChartDetailSwiper'
import VisitantList from '../table/VisitantList'

const LiveDataLineChart = dynamic(() => import('src/@core/components/charts/LiveDataLineChart'), {
  ssr: false
})

const generateSampleData = (count = 70): [number, number][] => {
  const data: [number, number][] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    data.push([now - (count - i) * 1000, Math.random() * 100])
  }

  return data
}

const Visitors: FC = ({}): React.ReactElement => {
  const [hoveredPoint, setHoveredPoint] = useState('')
  const [data, setData] = useState<[number, number][]>([])
  const [secondData, setSecondData] = useState<[number, number][]>([])

  const { data: barChart, isLoading: barChartLoading } = useCountBarChart()

  useEffect(() => {
    setData(generateSampleData())
    setSecondData(generateSampleData())
  }, [])

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
            <LiveDataLineChart selected={1} data={data} secondData={secondData} />
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
              selected={hoveredPoint}
              refetch={() => {
                console.log('refetch')
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <VisitantList
              data={barChart?.data?.exitsCountList || []}
              xcategories={barChart?.data?.xcategories || []}
              selected={hoveredPoint}
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
