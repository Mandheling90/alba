import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useState } from 'react'
import { MBarChart } from 'src/model/statistics/StatisticsModel'
import styled from 'styled-components'

interface IHorizontalBarChart {
  mainData: MBarChart[]
  subData: MBarChart[]
}

const HorizontalBarChart: React.FC<IHorizontalBarChart> = ({ mainData, subData }) => {
  const [highlightedPoint, setHighlightedPoint] = useState<string | null>(null)

  // const sortedTotal = mainData.sort((a, b) => {
  //   const targetColor = selectDataColor

  //   // 우선 색상을 기준으로 정렬
  //   if (a.color === targetColor && b.color !== targetColor) return -1 // a의 색상이 조건에 맞으면 상단으로
  //   if (a.color !== targetColor && b.color === targetColor) return 1 // b의 색상이 조건에 맞으면 b를 상단으로

  //   // 색상이 동일한 경우, id를 기준으로 정렬
  //   if (a.color === targetColor && b.color === targetColor) {
  //     return a.id - b.id // id 오름차순 정렬
  //   }

  //   return 0 // 그 외에는 순서 유지
  // })

  const sortedTotal = mainData.sort((a, b) => a.name.localeCompare(b.name))

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: sortedTotal.length * 30 > 500 ? sortedTotal.length * 30 : 500
    },

    title: {
      text: '',
      align: 'left'
    },

    plotOptions: {
      series: {
        borderWidth: 0,
        point: {
          events: {
            mouseOver() {
              setHighlightedPoint(this.name) // 마우스 오버한 카테고리 저장
            },
            mouseOut() {
              setHighlightedPoint(null) // 마우스가 벗어나면 초기화
            }
          }
        }
      }
    },

    legend: {
      enabled: false
    },

    tooltip: {},

    xAxis: {
      type: 'category',
      labels: {
        formatter: function () {
          return this.value.toString()
        }
      }
    },

    yAxis: [
      {
        title: {
          text: ''
        },
        showFirstLabel: false,
        opposite: true
      }
    ],

    series: [
      {
        color: 'rgba(115, 184, 255, 1)',
        pointPlacement: -0.2,
        linkedTo: 'main',
        data: sortedTotal.map((item, index) => ({
          name: item.name,
          y: item.y,
          color: item.color,
          opacity: highlightedPoint && highlightedPoint !== item.name ? 0.3 : 1 // 마우스 오버한 바는 1, 나머지는 0.3
        })),
        dataLabels: {
          enabled: true,
          inside: false,
          formatter: function () {
            const subDataValue = subData.find(item => item.name === this.key)?.y || 0

            // if (this.y === 0 || subDataValue === 0) {
            //   return null  // this.y 또는 subDataValue가 0이면 문구를 표시하지 않음
            // }

            return `${this.y}명 중 ${subDataValue}명`
          },
          style: {
            fontSize: '12px',
            color: '#666666'
          }
        },
        type: 'bar',
        name: '유동인구'
      },
      {
        name: '흡연자수',
        id: 'main',
        data: subData.map((item, index) => ({
          name: item.name,
          y: item.y,
          opacity: highlightedPoint && highlightedPoint !== item.name ? 0.3 : 1 // 마우스 오버한 바는 1, 나머지는 0.3
        })),
        type: 'column',
        color: 'rgb(250, 90, 68)',
        dataLabels: {
          enabled: true,
          inside: true,
          allowOverlap: true,
          formatter: function () {
            const maonDataValue = mainData.find(item => item.name === this.key)?.y || 0
            const percentage = ((this.y ?? 0 - maonDataValue) / maonDataValue) * 100

            return `${this.y} (${maonDataValue === 0 ? 0.0 : percentage.toFixed(1)}%)`
          },
          style: {
            fontSize: '14px'
          }
        }
      }
    ],

    exporting: {
      allowHTML: true
    }
  }

  return (
    <ChartWrapper>
      <HighchartsReact id='HorizontalBarChart' highcharts={Highcharts} options={chartOptions} />
    </ChartWrapper>
  )
}

const ChartWrapper = styled.div`
  padding-bottom: 30px;

  .highcharts-credits {
    display: none;
  }
`

export default React.memo(HorizontalBarChart, (prevProps, nextProps) => {
  // props 변경 조건을 지정하여 변경된 경우에만 렌더링
  return prevProps.mainData === nextProps.mainData && prevProps.subData === nextProps.subData
})
