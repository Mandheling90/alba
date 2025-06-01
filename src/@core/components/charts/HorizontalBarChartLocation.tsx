import Highcharts, { Chart as ChartType } from 'highcharts'
import { useEffect, useRef } from 'react'
import { IBarChart } from 'src/model/statistics/StatisticsModel'
import styled from 'styled-components'
import SwitchCustom from '../atom/SwitchCustom'

interface SeriesData {
  name: string
  data: number[]
}

interface HorizontalBarChartLocationProps {
  data: IBarChart
}

const HorizontalBarChartLocation = ({ data }: HorizontalBarChartLocationProps) => {
  const chartRef = useRef<ChartType | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      chartRef.current = Highcharts.chart({
        chart: {
          renderTo: 'location-chart-container',
          type: 'spline',
          ...(data.xcategories.length >= Number(process.env.NEXT_PUBLIC_CHART_SCROLL_COUNT) && {
            scrollablePlotArea: {
              minWidth: data.xcategories.length * 50,
              scrollPositionX: 0
            }
          }),
          events: {
            load: function (this: ChartType) {
              if (this.series && this.series.length > 0) {
                this.series[0].onMouseOver()
              }
            }
          }
        },
        legend: {
          enabled: true,
          align: 'right',
          verticalAlign: 'top',
          useHTML: true
        },
        xAxis: {
          categories: data.xcategories,
          title: {
            text: data.xtitle
          }
        },
        yAxis: {
          title: {
            text: data.ytitle
          },
          allowDecimals: false,
          min: 0
        },
        tooltip: {
          shared: false,
          headerFormat: '',
          pointFormat: '{series.name}: {point.y}명'
        },
        plotOptions: {
          series: {
            marker: {
              symbol: 'circle',
              fillColor: '#FFFFFF',
              enabled: true,
              radius: 2.5,
              lineWidth: 1,
              lineColor: undefined
            },
            states: {
              hover: {
                enabled: true,
                lineWidth: 3
              },
              inactive: {
                enabled: true,
                opacity: 0.3
              }
            }
          }
        },
        colors: ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#F3FF33', '#FF33A8'],
        series: data.chartDataList.map(data => ({
          type: 'spline' as const,
          name: data.name,
          data: data.dataList,
          lineWidth: 2,
          visible: true
        }))
      })
    }
  }, [data])

  const handleSwitchChange = (selected: boolean) => {
    if (chartRef.current) {
      chartRef.current.series.forEach((s: Highcharts.Series) => {
        s.setVisible(selected, false)
      })
      chartRef.current.redraw()
    }
  }

  return (
    <ChartWrapper>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <style>
          {`
          .highcharts-title {
            display: none;
          }
        `}
        </style>
        <div id='location-chart-container' style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', top: '10px', left: '50px' }}>
          <SwitchCustom
            width={90}
            switchName={['전체', '개별']}
            activeColor={['rgba(145, 85, 253, 1)', 'rgba(145, 85, 253, 1)']}
            selected={true}
            superSelected={false}
            onChange={selected => handleSwitchChange(selected)}
          />
        </div>
      </div>
    </ChartWrapper>
  )
}

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`

export default HorizontalBarChartLocation
