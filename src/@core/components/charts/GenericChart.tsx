import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RangeSelectorButtonTypeValue, timeRangeOptions } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { MLineChart } from 'src/model/statistics/StatisticsModel'
import styled from 'styled-components'

interface ChartProps {
  selected: number // 선택된 값
  data: MLineChart[]
  seriesTypes: ('line' | 'column')[] // 시리즈 타입 배열
  colors?: string[] // 색상 배열
  time?: RangeSelectorButtonTypeValue
}

const GenericChart: React.FC<ChartProps> = ({ selected, data, seriesTypes, colors, time }) => {
  const statistics = useStatistics()
  const chartRef = useRef<any>(null)
  const [tooltipContent, setTooltipContent] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0
  })

  const dayCheck = useRef<string>('')

  // 데이터의 시작과 끝 시간 계산
  const timestamps = data
    .filter(item => item.statsData.length > 0)
    .flatMap(item => item.statsData.map(point => point[0]))

  const minTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)

  // 차트가 렌더링된 후 xAxis 설정을 강제로 적용
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.chart
      chart.xAxis[0].setExtremes(minTimestamp, maxTimestamp)
    }

    // 데이터 1건 표시 예외처리
    if (data[0].statsData.length === 1) {
      const res = adjustedTime(minTimestamp, maxTimestamp)
      setTooltipContent({ min: res.adjustedMin, max: res.adjustedMax })
      statistics.setRange([minTimestamp, maxTimestamp])
    }
  }, [minTimestamp, maxTimestamp, data, selected])

  const adjustedTime = (min: any, max: any) => {
    const kstOffset = 9 * 60 * 60 * 1000 // 9시간 오프셋 (밀리초)
    let adjustedMin = min
    let adjustedMax = max

    if (time === 'hour') {
      const oneHour = 60 * 60 * 1000
      const halfHour = 30 * 60 * 1000

      if (max - min < oneHour) {
        adjustedMin = Math.floor(min / oneHour) * oneHour
        adjustedMax = adjustedMin + oneHour
      } else {
        adjustedMin =
          min % oneHour < halfHour ? Math.floor(min / oneHour) * oneHour : Math.ceil(min / oneHour) * oneHour
        adjustedMax =
          max % oneHour < halfHour ? Math.floor(max / oneHour) * oneHour : Math.ceil(max / oneHour) * oneHour
      }
    } else if (time === 'day') {
      const tempMax = max + kstOffset
      const tempMin = min + kstOffset

      adjustedMin = adjustedMin + kstOffset
      adjustedMax = adjustedMax + kstOffset

      const oneDay = 24 * 60 * 60 * 1000
      const noon = 12 * 60 * 60 * 1000

      // // 하루보다 작은 경우, min을 해당 날짜로 맞추고 다음날 12시로 설정
      if (tempMax - tempMin < oneDay) {
        adjustedMin = Math.floor(tempMin / oneDay) * oneDay
        adjustedMax = adjustedMin + oneDay
      } else {
        adjustedMin =
          tempMin % oneDay < noon ? Math.floor(tempMin / oneDay) * oneDay : Math.ceil(tempMin / oneDay) * oneDay
        adjustedMax =
          tempMax % oneDay < noon ? Math.floor(tempMax / oneDay) * oneDay : Math.ceil(tempMax / oneDay) * oneDay
      }

      adjustedMin = adjustedMin - kstOffset
      adjustedMax = adjustedMax - kstOffset
    }

    return { adjustedMin, adjustedMax }
  }

  const debouncedHandleSetExtremes = useCallback(
    debounce((min, max) => {
      const res = adjustedTime(min, max)

      if (statistics.range[0] !== res.adjustedMin || statistics.range[1] !== res.adjustedMax) {
        statistics.setRange([res.adjustedMin, res.adjustedMax])
      }
      chartRef.current.chart.xAxis[0].setExtremes(res.adjustedMin, res.adjustedMax)
      setTooltipContent({ min: res.adjustedMin, max: res.adjustedMax })
    }, 500),
    [statistics.range]
  )

  // 차트 옵션 설정
  const chartOptions: Highcharts.Options = {
    time: {
      timezoneOffset: 540 // KST의 오프셋 (9시간 * 60분)
    },

    xAxis: {
      type: 'datetime',
      min: minTimestamp !== Infinity ? minTimestamp : undefined,
      max: maxTimestamp !== -Infinity ? maxTimestamp : undefined,
      labels: {
        formatter: function () {
          const xAxis = (this as any).chart.xAxis[0]
          const timeRange: number = (xAxis.max ?? 0) - (xAxis.min ?? 0)
          const value: number = typeof this.value === 'number' ? this.value : Number(this.value)

          // KST로 변환하기 위해 9시간 (32400000ms) 추가
          const kstValue: number = value + 9 * 3600 * 1000

          if (timeRange >= 2592000000) {
            return Highcharts.dateFormat('%m월', kstValue)
          } else if (timeRange >= 24 * 3600 * 1000) {
            if (time === 'hour') {
              if (dayCheck.current !== Highcharts.dateFormat('%d', kstValue)) {
                dayCheck.current = Highcharts.dateFormat('%d', kstValue)

                return Highcharts.dateFormat('%m월 %d일 %H:%M', kstValue)
              } else {
                return Highcharts.dateFormat('%H:%M', kstValue)
              }
            } else {
              return Highcharts.dateFormat('%m월 %d일', kstValue)
            }
          } else {
            return Highcharts.dateFormat('%H:%M', kstValue)
          }
        }
      },
      events: {
        afterSetExtremes: function (e: any) {
          const min = e.min
          const max = e.max

          if (data[0].statsData.length !== 1) {
            const kstOffset = 9 * 60 * 60 * 1000

            const tooltipLeft = tooltipRefLeft.current
            const tooltipRight = tooltipRefRight.current
            if (tooltipLeft && tooltipRight) {
              tooltipLeft.textContent = `${Highcharts.dateFormat('%m월%d일 %H:%M', min + kstOffset)}`
              tooltipRight.textContent = `${Highcharts.dateFormat('%m월%d일 %H:%M', max + kstOffset)}`

              debouncedHandleSetExtremes(min, max)
            }
          }
        }
      }
    },

    tooltip: {
      split: true,
      formatter: function (): string[] {
        const x = typeof this.x === 'number' ? this.x : Number(this.x)
        const chartPoints = (this as any).points

        // KST로 변환하기 위해 9시간 (32400000ms) 추가
        const kstX: number = x + 9 * 3600 * 1000
        const tooltipArray: string[] = [
          `<div class='tooltipArray'> 
          ${Highcharts.dateFormat('%m월%d일 %H시', kstX)} 
        </div>`
        ]

        chartPoints?.forEach((point: any, index: number) => {
          const seriesName = point.series.name

          // 첫 번째 값이 존재하고, 두 번째 값을 처리할 때 퍼센티지 계산
          let percentageText = ''
          if (index === 1 && chartPoints[0]?.y) {
            const percentage = ((point.y ?? 0 - chartPoints[0].y) / chartPoints[0].y) * 100
            percentageText = `(${percentage.toFixed(1)}%)`
          }

          tooltipArray.push(
            `<div class='tooltip-${index}-area'>${seriesName}: <b>${point.y}</b>명 ${percentageText}</div>`
          )
        })

        return tooltipArray
      }
    },
    rangeSelector: {
      verticalAlign: 'top',

      // selected: selectedIndex,
      buttons: timeRangeOptions,
      buttonTheme: {
        fill: 'rgba(242, 235, 255, 1)',
        stroke: '#fff',
        strokeWidth: 0,
        style: {
          color: 'rgba(170, 122, 255, 1)',
          fontWeight: 'bold'
        },
        states: {
          hover: {
            fill: 'rgba(158, 105, 253, 1)',
            style: {
              color: '#fff'
            }
          },
          select: {
            fill: 'rgba(158, 105, 253, 1)',
            style: {
              color: '#fff'
            }
          }
        }
      },
      inputDateFormat: '%Y년 %m월 %d일',
      buttonPosition: {
        align: 'left'
      },
      inputPosition: {
        align: 'left',
        x: 150,
        y: -30
      },
      dropdown: 'never'
    },
    navigator: {
      enabled: true,

      xAxis: {
        min: minTimestamp,
        max: maxTimestamp
      }
    },
    series: data.map((list, index) => ({
      type: seriesTypes[index],
      color: colors ? colors[index] : list.color,
      data: list.statsData,
      name: list.label
    }))
  }

  const tooltipRefLeft = useRef<HTMLDivElement>(null)
  const tooltipRefRight = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleLeftElement = document.querySelector('.highcharts-navigator-handle-left')
    const handleRightElement = document.querySelector('.highcharts-navigator-handle-right')

    if (!handleLeftElement || !handleRightElement) return

    const showTooltip = () => {
      const tooltipLeft = tooltipRefLeft.current
      const tooltipRight = tooltipRefRight.current

      if (tooltipLeft && tooltipRight && handleLeftElement && handleRightElement) {
        // 왼쪽 핸들의 위치 계산
        const leftRect = handleLeftElement.getBoundingClientRect()
        tooltipLeft.style.display = 'block'
        tooltipLeft.style.left = `${leftRect.left + window.scrollX - tooltipLeft.offsetWidth - 12}px`
        tooltipLeft.style.top = `${
          leftRect.top + window.scrollY + leftRect.height / 2 - tooltipLeft.offsetHeight / 2 - 8
        }px`

        // 오른쪽 핸들의 위치 계산
        const rightRect = handleRightElement.getBoundingClientRect()
        tooltipRight.style.display = 'block'
        tooltipRight.style.left = `${rightRect.right + window.scrollX + 12}px`
        tooltipRight.style.top = `${
          rightRect.top + window.scrollY + rightRect.height / 2 - tooltipRight.offsetHeight / 2 - 8
        }px`
      }
    }

    const hideTooltip = () => {
      const tooltipLeft = tooltipRefLeft.current
      const tooltipRight = tooltipRefRight.current
      if (tooltipLeft) tooltipLeft.style.display = 'none'
      if (tooltipRight) tooltipRight.style.display = 'none'
    }

    // 마우스 오버 및 이동 이벤트
    handleLeftElement.addEventListener('mouseover', showTooltip)
    handleLeftElement.addEventListener('mousemove', showTooltip)
    handleLeftElement.addEventListener('mouseout', hideTooltip)

    handleRightElement.addEventListener('mouseover', showTooltip)
    handleRightElement.addEventListener('mousemove', showTooltip)
    handleRightElement.addEventListener('mouseout', hideTooltip)

    return () => {
      handleLeftElement.removeEventListener('mouseover', showTooltip)
      handleLeftElement.removeEventListener('mousemove', showTooltip)
      handleLeftElement.removeEventListener('mouseout', hideTooltip)

      handleRightElement.removeEventListener('mouseover', showTooltip)
      handleRightElement.removeEventListener('mousemove', showTooltip)
      handleRightElement.removeEventListener('mouseout', hideTooltip)
    }
  }, [tooltipContent.max, tooltipContent.min])

  return (
    <HighchartsWrapper>
      <div
        ref={tooltipRefLeft}
        style={{
          position: 'absolute',
          display: 'none',
          padding: '5px',
          backgroundColor: '#333',
          color: 'white',
          borderRadius: '3px',
          fontSize: '12px',
          pointerEvents: 'none',
          zIndex: 10
        }}
      />
      <div
        ref={tooltipRefRight}
        style={{
          position: 'absolute',
          display: 'none',
          padding: '5px',
          backgroundColor: '#333',
          color: 'white',
          borderRadius: '3px',
          fontSize: '12px',
          pointerEvents: 'none',
          zIndex: 10
        }}
      />

      <HighchartsReact ref={chartRef} highcharts={Highcharts} constructorType={'stockChart'} options={chartOptions} />
    </HighchartsWrapper>
  )
}

const HighchartsWrapper = styled.div`
  .highcharts-range-selector-group {
    display: none;
  }
  .highcharts-credits {
    display: none;
  }
`

export default React.memo(GenericChart, (prevProps, nextProps) => {
  // props 변경 조건을 지정하여 변경된 경우에만 렌더링
  return prevProps.data === nextProps.data
})
