import { Card, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState } from 'react'
import BarChart from 'src/@core/components/charts/BarChart'
import PieChart from 'src/@core/components/charts/PieChart'

import PyramidChart from 'src/@core/components/charts/PyramidChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import IconCustom from 'src/layouts/components/IconCustom'
import { exampleMVisitant } from 'src/model/dashboard/dashboard'
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

const VisitorAttributes: FC = ({}): React.ReactElement => {
  const [data, setData] = useState<[number, number][]>([])
  const [secondData, setSecondData] = useState<[number, number][]>([])
  const [hoveredPoint, setHoveredPoint] = useState<string>('')

  useEffect(() => {
    setData(generateSampleData())
    setSecondData(generateSampleData())
  }, [])

  return (
    <StandardTemplate title={'방문자 특성 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' />}
            title={['시간별 방문자수', '2025년 2월 7일 0시 ~ 18시', '총 12 곳']}
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
            title={['장소별 방문자수', '2025년 2월 7일 0시 ~ 18시', '총 12 곳']}
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <BarChart
              onHover={category => {
                setHoveredPoint(category)
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
              selected={hoveredPoint}
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
              selected={hoveredPoint}
            />
          </Card>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorAttributes
