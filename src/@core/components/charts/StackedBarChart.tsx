import Highcharts from 'highcharts'
import { useEffect } from 'react'

interface StackedBarChartProps {
  containerId: string
  maleData: number[]
  femaleData: number[]
}

const StackedBarChart = ({ containerId, maleData, femaleData }: StackedBarChartProps) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Highcharts.chart({
        chart: {
          type: 'column',
          renderTo: containerId
        },
        title: {
          text: '시간대별 방문자 수 (남성 vs 여성)',
          align: 'left'
        },
        xAxis: {
          categories: Array.from({ length: 24 }, (_, i) => `${i}시`),
          title: {
            text: '시간'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: '방문자 수'
          },
          stackLabels: {
            enabled: true
          }
        },
        legend: {
          align: 'left',
          x: 70,
          verticalAlign: 'top',
          y: 70,
          floating: true,
          backgroundColor: Highcharts.defaultOptions.legend?.backgroundColor || 'white',
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false
        },
        tooltip: {
          headerFormat: '<b>{category}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>총 방문자: {point.stackTotal}'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [
          {
            name: '남성',
            type: 'column',
            data: maleData
          },
          {
            name: '여성',
            type: 'column',
            data: femaleData
          }
        ]
      })
    }
  }, [containerId, maleData, femaleData])

  return <div id={containerId} />
}

export default StackedBarChart

// 사용 예시
export const VisitorChartExample = () => {
  const exampleMaleData = [
    0, 0, 0, 0, 0, 0, 20, 45, 92, 119, 705, 816, 936, 1333, 1306, 1180, 1008, 269, 46, 3, 2, 1, 0, 0
  ]
  const exampleFemaleData = [
    0, 0, 0, 0, 0, 0, 22, 44, 221, 209, 1199, 1306, 1491, 2118, 1959, 1801, 1561, 381, 11, 9, 7, 6, 5, 4
  ]

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <StackedBarChart containerId='visitor-chart-example' maleData={exampleMaleData} femaleData={exampleFemaleData} />
    </div>
  )
}
