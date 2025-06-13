import { Box, Card, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FC, useEffect, useRef, useState } from 'react'
import BarChart from 'src/@core/components/charts/BarChart'
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
  useCountLineChartPolling
} from 'src/service/statistics/statisticsService'
import ChartDetailSwiper from '../swiper/ChartDetailSwiper'
import VisitantList from '../table/VisitantList'

const LiveDataLineChart = dynamic(() => import('src/@core/components/charts/LiveDataLineChart'), {
  ssr: false
})

const Visitors: FC = ({}): React.ReactElement => {
  const { layoutDisplay, setLayoutDisplay, companyId, companyName } = useLayout()
  const mainGridRef = useRef<HTMLDivElement>(null)
  const [mainGridHeight, setMainGridHeight] = useState<number>(0)

  const [hoveredPoint, setHoveredPoint] = useState('')
  const [lastCheckDate, setLastCheckDate] = useState<string>('')
  const [timeStr, setTimeStr] = useState<string | undefined>(undefined)

  const { data: lineChart, isLoading: lineChartLoading, refetch: lineChartRefetch } = useCountLineChart({ type: 1 })
  const { data: barChart, isLoading: barChartLoading, refetch: barChartRefetch } = useCountBarChart({ type: 1 })
  const { mutateAsync: livePollingMutate } = useCountLineChartPolling()
  const { data: cardInfo, refetch: cardInfoRefetch } = useCountCardInfo({ type: 1 })

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
  }, [lineChartRefetch, barChartRefetch, cardInfoRefetch, lineChart?.data?.lineDataList])

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

  if (lineChartLoading || barChartLoading) {
    return <></>
  }

  const sideContent = <ClientListGrid />

  const mainContent = (
    <Grid container spacing={5} alignItems={'flex-end'} ref={mainGridRef}>
      <Grid item xs={12}>
        <PipelineTitle
          Icon={<IconCustom isCommon path='dashboard' icon='calendar' style={{ width: 23, height: 23 }} />}
          title={[
            `${lineChart?.data?.chartTitle}`,
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
            livePollingMutate={params => livePollingMutate({ ...params, type: 1 })}
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
          Icon={<IconCustom isCommon path='dashboard' icon='chart' style={{ width: 23, height: 23 }} />}
          title={[
            `${barChart?.data?.chartTitle}`,
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
            selected={hoveredPoint}
            refetch={() => {
              console.log('refetch')
            }}
          />
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          {barChart?.data?.exitCountList && barChart?.data?.exitCountList.length > 0 && (
            <VisitantList
              data={barChart?.data?.exitCountList || []}
              xcategories={barChart?.data?.xcategories || []}
              selected={hoveredPoint}
              refetch={() => {
                console.log('refetch')
              }}
            />
          )}
        </Card>
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
          title={'방문자수 통계'}
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

export default Visitors
