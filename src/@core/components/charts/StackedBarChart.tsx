import Highcharts from 'highcharts'
import { useEffect } from 'react'
import { ICountBarChart } from 'src/model/statistics/StatisticsModel'
import styled from 'styled-components'

interface StackedBarChartProps {
  containerId: string
  data: ICountBarChart
}

const StackedBarChart = ({ containerId, data }: StackedBarChartProps) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Highcharts.chart({
        chart: {
          type: 'column',
          renderTo: containerId
        },
        title: {
          text: '',
          align: 'left'
        },
        xAxis: {
          categories: data.xaxisDataList,
          title: {
            text: data.xtitle
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: data.ytitle
          },
          stackLabels: {
            enabled: true
          }
        },
        legend: {
          align: 'right',
          x: -10,
          verticalAlign: 'top',
          y: 0
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
            name: data.chartDataList[0].name,
            type: 'column',
            data: data.chartDataList[0].dataList
          },
          {
            name: data.chartDataList[1].name,
            type: 'column',
            data: data.chartDataList[1].dataList
          }
        ]
      })
    }
  }, [containerId, data])

  return (
    <ChartWrapper>
      <div id={containerId} />
    </ChartWrapper>
  )
}

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`

export default StackedBarChart
