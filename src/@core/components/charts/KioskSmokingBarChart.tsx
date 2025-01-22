import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
import React, { useEffect, useRef, useState } from 'react'
import { timeRangeOptions } from 'src/enum/statisticsEnum'
import styled from 'styled-components'

interface BitcoinChartProps {
  selected: number // 선택된 값
  data: [number, number][] // 첫 번째 데이터 배열
  secondData: [number, number][] // 두 번째 데이터 배열
}

const KioskSmokingBarChart: React.FC<BitcoinChartProps> = ({ selected, data, secondData }) => {
  const chartRef = useRef<any>(null)

  const [selectedIndex, setSelectedIndex] = useState(selected)

  useEffect(() => {
    setSelectedIndex(selected)
  }, [selected])

  // 데이터의 시작과 끝 시간 계산
  const minTimestamp = Math.min(...data.map(point => point[0]), ...secondData.map(point => point[0]))
  const maxTimestamp = Math.max(...data.map(point => point[0]), ...secondData.map(point => point[0]))

  // 차트 옵션 설정
  const chartOptions: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
      min: minTimestamp,
      max: maxTimestamp,
      labels: {
        formatter: function () {
          const xAxis = this.chart.xAxis[0]
          const timeRange = (xAxis.max ?? 0) - (xAxis.min ?? 0)
          const value = typeof this.value === 'number' ? this.value : Number(this.value)

          if (timeRange >= 2592000000) {
            // 월
            return Highcharts.dateFormat('%m월', value)
          } else if (timeRange >= 24 * 3600 * 1000) {
            // 일
            return Highcharts.dateFormat('%m월 %d일', value)
          } else {
            // 1일 이하의 범위
            return Highcharts.dateFormat('%H:%M', value)
          }
        }
      }
    },
    tooltip: {
      split: true,
      formatter: function () {
        const x = typeof this.x === 'number' ? this.x : Number(this.x)

        const points = this.points,
          tooltipArray = [Highcharts.dateFormat('%m월%d일 %H:%M', x) + '</b>']

        points?.forEach(function (point, index) {
          tooltipArray.push('VALUE: <b>' + point.y + '</b>명')
        })

        return tooltipArray
      }
    },
    rangeSelector: {
      verticalAlign: 'top',
      selected: selectedIndex, // selected props에 따라 선택된 버튼 인덱스 설정
      buttons: timeRangeOptions,

      buttonTheme: {
        fill: 'rgba(242, 235, 255, 1)', // 배경 색상
        stroke: '#fff', // 테두리 색상
        strokeWidth: 0,
        style: {
          color: 'rgba(170, 122, 255, 1)', // 텍스트 색상
          fontWeight: 'bold' // 글자 굵기
        },
        states: {
          hover: {
            fill: 'rgba(158, 105, 253, 1)', // hover 시 배경 색상
            style: {
              color: '#fff' // hover 시 텍스트 색상
            }
          },
          select: {
            fill: 'rgba(158, 105, 253, 1)', // 선택된 상태에서의 배경 색상
            style: {
              color: '#fff' // 선택된 상태에서의 텍스트 색상
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
      enabled: true
    },
    series: [
      {
        type: 'line',
        color: '#ffbf00',
        data: data // 첫 번째 라인 데이터
      },
      {
        type: 'line', // 두 번째 라인 추가
        color: '#0071a7', // 두 번째 라인의 색상
        data: secondData // 두 번째 데이터
      }
    ]
  }

  return (
    <HighchartsWrapper>
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

export default KioskSmokingBarChart
