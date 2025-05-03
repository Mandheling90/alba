import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { memo } from 'react'
import { IDashboardAgeChart } from 'src/model/statistics/StatisticsModel'
import { areEqual } from 'src/utils/CommonUtil'

const PieChart = memo(({ data }: { data: IDashboardAgeChart }) => {
  const options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: data.pieChart.name
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
            distance: 20
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
        name: '방문자수',
        colorByPoint: true,
        data: data.pieChart.data
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}, areEqual)

PieChart.displayName = 'PieChart'

export default PieChart
