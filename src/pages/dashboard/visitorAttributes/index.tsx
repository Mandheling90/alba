import { Box, Card, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC, useEffect, useRef, useState } from 'react'
import BarChart from 'src/@core/components/charts/BarChart'
import PieChart from 'src/@core/components/charts/PieChart'

import PyramidChart from 'src/@core/components/charts/PyramidChart'
import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import PipelineTitle from 'src/@core/components/molecule/PipelineTitle'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'
import ClientListGrid from 'src/pages/user-setting/client/ClientListGrid'
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
  const { layoutDisplay, setLayoutDisplay, companyId, companyName } = useLayout()
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

      // lineChart?.data?.lineDataList가 없거나 빈 배열일 경우 30초 후에 lineChartRefetch 실행
      if (
        !lineChart?.data?.lineDataList ||
        lineChart.data.lineDataList.length === 0 ||
        lineChart.data.lineDataList[0].dataList.length === 0 ||
        lineChart.data.lineDataList[1].dataList.length === 0
      ) {
        lineChartRefetch()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [lineChartRefetch, genderAgeChartRefetch, barChartRefetch, cardInfoRefetch, lineChart?.data?.lineDataList])

  const mainGridRef = useRef<HTMLDivElement>(null)
  const [mainGridHeight, setMainGridHeight] = useState<number>(0)

  useEffect(() => {
    if (mainGridRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setMainGridHeight(entry.contentRect.height)
        }
      })

      resizeObserver.observe(mainGridRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [lineChart, barChart, cardInfo]) // 데이터가 변경될 때마다 높이 재측정

  const sideContent = <ClientListGrid />

  const mainContent = (
    <Grid container spacing={5} alignItems={'flex-end'} ref={mainGridRef}>
      <Grid item xs={12}>
        <PipelineTitle
          Icon={<IconCustom isCommon path='dashboard' icon='calendar' style={{ width: 23, height: 23 }} />}
          title={[
            lineChart?.data?.chartTitle ?? '',
            `${lineChart?.data?.chartSubTitle}`,
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
            genderAgeChart?.data?.chartTitle ?? '',
            `${genderAgeChart?.data?.chartSubTitle}`,
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
            barChart?.data?.chartTitle ?? '',
            `${barChart?.data?.chartSubTitle}`,
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
  )

  return (
    <>
      <Box sx={{ my: 8 }}>
        <LayoutControlPanel
          menuName='고객사'
          companyId={companyId}
          companyName={companyName}
          title={'방문자 특성 통계'}
          onClick={() => {
            setLayoutDisplay(!layoutDisplay)
          }}
        />
      </Box>
      <SlidingLayout
        isOpen={layoutDisplay}
        sideContent={sideContent}
        mainContent={mainContent}
        maxHeight={`${mainGridHeight - 20}px`}
      />
    </>
  )
}

export default VisitorAttributes
