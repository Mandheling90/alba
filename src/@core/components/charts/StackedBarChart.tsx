import type { Options } from 'highcharts'
import Highcharts from 'highcharts/highstock'
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
      const isScrollEnabled = data.xaxisDataList.length > Number(process.env.NEXT_PUBLIC_CHART_SCROLL_COUNT)

      const commonOptions: Options = {
        chart: {
          type: 'column',
          renderTo: containerId,
          panning: {
            enabled: false,
            type: 'x' as const
          }
        },
        title: {
          text: '',
          align: 'left'
        },
        xAxis: {
          categories: data.xaxisDataList,
          type: 'category',
          title: {
            text: data.xtitle
          },
          labels: {
            style: {
              fontSize: '12px'
            },
            formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
              return data.xaxisDataList[this.pos]
            }
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
          headerFormat: '',
          pointFormat: '{series.name}: {point.y}<br/>총 방문자: {point.stackTotal}'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              formatter: function (this: Highcharts.Point) {
                return this.y === 0 ? '' : this.y
              }
            }
          },
          series: {
            enableMouseTracking: true,
            stickyTracking: false,
            animation: false
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
      }

      const stockOptions: Options = {
        ...commonOptions,
        navigator: {
          enabled: isScrollEnabled,
          xAxis: {
            labels: {
              enabled: false
            }
          },
          series: [
            {
              type: 'column',
              name: data.chartDataList[0].name,
              data: data.chartDataList[0].dataList
            },
            {
              type: 'column',
              name: data.chartDataList[1].name,
              data: data.chartDataList[1].dataList
            }
          ]
        },
        rangeSelector: {
          enabled: isScrollEnabled
        },
        scrollbar: {
          enabled: isScrollEnabled
        }
      }

      if (isScrollEnabled) {
        Highcharts.stockChart(stockOptions)
      } else {
        Highcharts.chart(commonOptions)
      }
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
  .highcharts-range-selector-group {
    display: none;
  }
`

export default StackedBarChart
