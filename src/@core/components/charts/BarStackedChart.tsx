import type { Options } from 'highcharts'
import Highcharts from 'highcharts/highstock'
import React, { useEffect } from 'react'
import { ICountBarChart } from 'src/model/statistics/StatisticsModel'
import styled from 'styled-components'

const BarStackedChart: React.FC<{ data: ICountBarChart }> = ({ data }) => {
  useEffect(() => {
    const isScrollEnabled = data.xcategories.length > Number(process.env.NEXT_PUBLIC_CHART_SCROLL_COUNT)

    const commonOptions: Options = {
      chart: {
        renderTo: 'container',
        type: 'column',
        panning: {
          enabled: false,
          type: 'x' as const
        }
      },
      title: {
        text: '24시간 입장자 및 퇴장자 비교'
      },
      xAxis: {
        categories: data.xcategories,
        type: 'category',
        crosshair: false,
        title: {
          text: data.xtitle
        },
        labels: {
          style: {
            fontSize: '12px'
          },
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            return data.xcategories[this.pos]
          }
        }
      },
      yAxis: {
        min: 0,
        crosshair: false,
        title: {
          text: data.ytitle
        }
      },
      tooltip: {
        shared: false,
        headerFormat: ''
      },
      plotOptions: {
        column: {
          grouping: false,
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
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'top',
        useHTML: true
      },
      series: [
        {
          type: 'column',
          name: data.chartDataList[0].name,
          data: data.chartDataList[0].dataList,
          color: '#544FC5',
          pointPlacement: -0.2
        },
        {
          type: 'column',
          name: data.chartDataList[1].name,
          data: data.chartDataList[1].dataList,
          color: '#2CAFFE'
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
            data: data.chartDataList[0].dataList,
            color: '#544FC5'
          },
          {
            type: 'column',
            name: data.chartDataList[1].name,
            data: data.chartDataList[1].dataList,
            color: '#2CAFFE'
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
  }, [data])

  return (
    <ChartWrapper>
      <div id='container' style={{ height: '400px', width: '100%' }} />
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

export default BarStackedChart
