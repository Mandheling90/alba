import Highcharts, { Chart as ChartType } from 'highcharts'
import { useEffect, useRef, useState } from 'react'
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
  const [legendItems, setLegendItems] = useState<{ name: string; color: string; visible: boolean }[]>([])

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

                // 범례 아이템 상태 업데이트
                const items = this.series.map(series => ({
                  name: series.name,
                  color: series.color?.toString() || '#000000',
                  visible: series.visible
                }))
                setLegendItems(items)
              }
            }
          }
        },
        legend: {
          enabled: false // 기본 범례 비활성화
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

  const handleLegendClick = (index: number) => {
    if (chartRef.current) {
      const series = chartRef.current.series[index]
      series.setVisible(!series.visible, false)
      chartRef.current.redraw()

      // 범례 상태 업데이트
      setLegendItems(prev => prev.map((item, i) => (i === index ? { ...item, visible: !item.visible } : item)))
    }
  }

  const handleSwitchChange = (selected: boolean) => {
    if (chartRef.current) {
      // selected가 true면 전체 표시, false면 전체 숨김
      chartRef.current.series.forEach((s: Highcharts.Series) => {
        s.setVisible(selected, false)
      })
      chartRef.current.redraw()

      // 범례 상태도 함께 업데이트
      setLegendItems(prev =>
        prev.map(item => ({
          ...item,
          visible: selected
        }))
      )
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
        <TopContainer>
          <TopControlsContainer>
            <SwitchCustom
              width={60}
              switchName={['전체', '개별']}
              activeColor={['rgba(145, 85, 253, 1)', 'rgba(145, 85, 253, 1)']}
              selected={true}
              superSelected={false}
              onChange={selected => handleSwitchChange(selected)}
            />
          </TopControlsContainer>
          <LegendContainer>
            <LegendWrapper>
              {legendItems.map((item, index) => (
                <LegendItem
                  key={index}
                  onClick={() => handleLegendClick(index)}
                  style={{ opacity: item.visible ? 1 : 0.3 }}
                >
                  <LegendColor style={{ backgroundColor: item.color }} />
                  <LegendText>{item.name}</LegendText>
                </LegendItem>
              ))}
            </LegendWrapper>
          </LegendContainer>
        </TopContainer>

        <div id='location-chart-container' style={{ width: '100%', height: 'calc(100% - 40px)' }} />
      </div>
    </ChartWrapper>
  )
}

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`
const TopContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  column-gap: 14px;
  margin-bottom: 4px;
`

const TopControlsContainer = styled.div`
  width: auto;
`

const LegendContainer = styled.div`
  flex: 1;
  overflow-x: auto;
  background-color: white;
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }
`

const LegendWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  white-space: nowrap;
  padding: 4px 0;
  border-radius: 4px;

  &:first-child {
    margin-left: auto;
  }
  &:last-child {
    margin-right: auto;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
`

const LegendText = styled.span`
  font-size: 12px;
  color: #333;
`

export default HorizontalBarChartLocation
