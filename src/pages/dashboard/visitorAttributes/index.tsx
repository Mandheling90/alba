import { Card, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState } from 'react'
import BarChart from 'src/@core/components/charts/BarChart'
import PieChart from 'src/@core/components/charts/PieChart'

import PyramidChart from 'src/@core/components/charts/PyramidChart'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import IconCustom from 'src/layouts/components/IconCustom'
import {
  useCountBarChart,
  useCountCardInfo,
  useCountLineChart,
  useCountLineChartPolling,
  useGenderAgeChart
} from 'src/service/statistics/statisticsService'
import ChartDetailSwiper from '../swiper/ChartDetailSwiper'
import VisitantList from '../table/VisitantList'

const LiveDataLineChart = dynamic(() => import('src/@core/components/charts/LiveDataLineChart'), {
  ssr: false
})

const VisitorAttributes: FC = ({}): React.ReactElement => {
  const [hoveredPoint, setHoveredPoint] = useState<string>('')
  const [lastCheckDate, setLastCheckDate] = useState<string>('')
  const [timeStr, setTimeStr] = useState<string | undefined>(undefined)

  const { data: lineChart, refetch: lineChartRefetch } = useCountLineChart({ type: 2 })
  const { data: genderAgeChart, refetch: genderAgeChartRefetch } = useGenderAgeChart()
  const { data: barChart, refetch: barChartRefetch } = useCountBarChart({ type: 2 })
  const { mutateAsync: livePollingMutate } = useCountLineChartPolling()
  const { data: cardInfo, refetch: cardInfoRefetch } = useCountCardInfo({ type: 2 })

  // 날짜 변경 체크
  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = new Date().toLocaleDateString()
      if (lastCheckDate && lastCheckDate !== currentDate) {
        lineChartRefetch()
        barChartRefetch()
      }
      setLastCheckDate(currentDate)
    }

    checkDateChange()
    const interval = setInterval(checkDateChange, 1000 * 60 * 5) // 5분마다 체크

    return () => clearInterval(interval)
  }, [lastCheckDate, lineChartRefetch, barChartRefetch])

  useEffect(() => {
    const interval = setInterval(() => {
      barChartRefetch()
      genderAgeChartRefetch()
      cardInfoRefetch()
    }, 30000)

    return () => clearInterval(interval)
  }, [lineChartRefetch, genderAgeChartRefetch, barChartRefetch, cardInfoRefetch])

  return (
    <StandardTemplate title={'방문자 특성 통계'}>
      <Grid container spacing={5} alignItems={'flex-end'}>
        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' style={{ width: 23, height: 23 }} />}
            title={[
              '방문자수 통계',
              `${lineChart?.data?.year}년 ${lineChart?.data?.month}월 ${lineChart?.data?.day}일 0시 ~ ${
                timeStr ?? lineChart?.data?.endHour
              }시`,
              `총 ${lineChart?.data?.totalPlaceCount} 곳`
            ]}
            marginBottom={-8}
          />
        </Grid>
        <Grid item xs={9}>
          <Card>
            <LiveDataLineChart
              selected={1}
              data={lineChart?.data?.lineDataList || []}
              livePollingMutate={params => livePollingMutate({ ...params, type: 2 })}
              onTimeStrChange={timeStr => {
                setTimeStr(timeStr)
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={3}>
          {cardInfo?.data && <ChartDetailSwiper height={'430px'} data={cardInfo?.data} />}
        </Grid>

        <Grid item xs={12}>
          <PipelineTitle
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' style={{ width: 23, height: 23 }} />}
            title={[
              '방문자수 통계',
              `${lineChart?.data?.year}년 ${lineChart?.data?.month}월 ${lineChart?.data?.day}일 0시 ~ ${
                timeStr ?? lineChart?.data?.endHour
              }시`,
              `총 ${lineChart?.data?.totalPlaceCount} 곳`
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
            Icon={<IconCustom isCommon path='dashboard' icon='calendar' style={{ width: 23, height: 23 }} />}
            title={[
              '방문자수 통계',
              `${lineChart?.data?.year}년 ${lineChart?.data?.month}월 ${lineChart?.data?.day}일 0시 ~ ${
                timeStr ?? lineChart?.data?.endHour
              }시`,
              `총 ${lineChart?.data?.totalPlaceCount} 곳`
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
        <Grid item xs={barChart?.data?.exitCountList && barChart?.data?.exitCountList.length > 0 ? 6 : 12}>
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
          {barChart?.data?.exitCountList && barChart?.data?.exitCountList.length > 0 && (
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
          )}
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default VisitorAttributes
