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
  const legendWrapperRef = useRef<HTMLDivElement>(null)
  const [showFadeLeft, setShowFadeLeft] = useState(false)
  const [showFadeRight, setShowFadeRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

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

  const updateFadeVisibility = () => {
    if (legendWrapperRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = legendWrapperRef.current
      setShowFadeLeft(scrollLeft > 5)
      setShowFadeRight(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  useEffect(() => {
    updateFadeVisibility()
    window.addEventListener('resize', updateFadeVisibility)

    return () => window.removeEventListener('resize', updateFadeVisibility)
  }, [])

  const handleScroll = () => {
    updateFadeVisibility()
  }

  const handleNavClick = (direction: 'left' | 'right') => {
    if (legendWrapperRef.current) {
      const itemWidth = 150 // 예상 아이템 너비
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth
      legendWrapperRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!legendWrapperRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - legendWrapperRef.current.offsetLeft)
    setScrollLeft(legendWrapperRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !legendWrapperRef.current) return
    e.preventDefault()
    const x = e.pageX - legendWrapperRef.current.offsetLeft
    const walk = (x - startX) * 2
    legendWrapperRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
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
        </TopContainer>

        <div id='location-chart-container' style={{ width: '100%', height: 'calc(100% - 100px)' }} />

        <LegendWrapperContainer>
          <NavButton onClick={() => handleNavClick('left')} style={{ left: '-35px' }}>
            &#8249;
          </NavButton>
          <FadeOverlay className={showFadeLeft ? '' : 'hidden'} style={{ left: 0 }} />
          <LegendContainerWrapper
            ref={legendWrapperRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <LegendContainer>
              {legendItems.map((item, index) => (
                <LegendItem
                  key={index}
                  onClick={() => handleLegendClick(index)}
                  className={item.visible ? 'active' : ''}
                >
                  <LegendColor style={{ backgroundColor: item.color }} />
                  <LegendText>{item.name}</LegendText>
                </LegendItem>
              ))}
            </LegendContainer>
          </LegendContainerWrapper>
          <FadeOverlay className={showFadeRight ? '' : 'hidden'} style={{ right: 0 }} />
          <NavButton onClick={() => handleNavClick('right')} style={{ right: '-35px' }}>
            &#8250;
          </NavButton>
        </LegendWrapperContainer>
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
`

const TopControlsContainer = styled.div`
  width: auto;
`

const LegendWrapperContainer = styled.div`
  position: relative;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
  padding: 10px 0;
`

const LegendContainerWrapper = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  user-select: none;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 0 30px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

const LegendItem = styled.div`
  flex: 0 0 auto;
  padding: 5px 10px;
  margin: 0 5px;
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  gap: 5px;

  &.active {
    background: #e0e0e0;
    font-weight: bold;
  }

  &:hover {
    background: #e0e0e0;
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

const FadeOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30px;
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.3s;

  &[style*='left'] {
    background: linear-gradient(to right, white 0%, transparent 100%);
  }

  &[style*='right'] {
    background: linear-gradient(to left, white 0%, transparent 100%);
  }

  &.hidden {
    opacity: 0;
  }
`

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  z-index: 3;
  user-select: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`

export default HorizontalBarChartLocation
