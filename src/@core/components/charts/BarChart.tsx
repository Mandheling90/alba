import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { memo, useEffect, useMemo } from 'react'
import { IDashboardCountBarChart } from 'src/model/statistics/StatisticsModel'
import { areEqual } from 'src/utils/CommonUtil'
import styled from 'styled-components'

interface IBarChart {
  onHover?: (category: string) => void // 선택된 값
  data?: IDashboardCountBarChart
}

const BarChart = memo(({ onHover, data }: IBarChart) => {
  const options = useMemo(
    () => ({
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: data?.xcategories,
        crosshair: true,
        accessibility: {
          description: 'Countries'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: data?.yname
        }
      },
      tooltip: {
        valueSuffix: ' 명'
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
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
          name: data?.barDataList?.[0]?.name,
          data: data?.barDataList?.[0]?.dataList,
          point: {
            events: {
              mouseOver: function (this: Highcharts.Point) {
                onHover?.(String(this.category))
              },
              mouseOut: function () {
                onHover?.('')
              }
            }
          }
        },
        {
          name: data?.barDataList?.[1]?.name,
          data: data?.barDataList?.[1]?.dataList,
          point: {
            events: {
              mouseOver: function (this: Highcharts.Point) {
                onHover?.(String(this.category))
              },
              mouseOut: function () {
                onHover?.('')
              }
            }
          }
        }
      ]
    }),
    [data, onHover]
  )

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .highcharts-title {
        display: none;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <ChartWrapper>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ChartWrapper>
  )
}, areEqual)

BarChart.displayName = 'BarChart'

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`

export default BarChart
