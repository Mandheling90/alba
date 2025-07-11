import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { memo } from 'react'
import { IPieChart } from 'src/model/statistics/StatisticsModel'
import { areEqual } from 'src/utils/CommonUtil'
import styled from 'styled-components'

const PieChart = memo(({ data }: { data: IPieChart }) => {
  const options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: data.name
    },
    tooltip: {
      valueSuffix: '명'
    },
    subtitle: {
      text: ''
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            formatter: function (this: any): string {
              const text = this.point.name

              return data.data.length >= 10 && text.length > 5 ? text.substring(0, 5) + '...' : text
            }
          },
          {
            enabled: true,
            distance: -40,
            format: '{point.percentage:.1f}%',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }
        ]
      }
    },
    series: [
      {
        name: data.name,
        colorByPoint: true,
        data: data.data
      }
    ]
  }

  return (
    <ChartWrapper>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ChartWrapper>
  )
}, areEqual)

PieChart.displayName = 'PieChart'

const ChartWrapper = styled.div`
  width: 100%;
  .highcharts-credits {
    display: none;
  }
`

export default PieChart
