import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// Age categories
const categories = ['10대 이하', '10대', '20대', '30대', '40대', '50대', '60대 이상']

const PyramidChart = () => {
  const options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: '방문자 연령 및 성별 비율'
    },
    subtitle: {
      text: ''
    },
    accessibility: {
      point: {
        valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
      }
    },
    xAxis: [
      {
        categories: categories,
        reversed: false,
        labels: {
          step: 1
        },
        accessibility: {
          description: 'Age (male)'
        }
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
          step: 1
        },
        accessibility: {
          description: 'Age (female)'
        }
      }
    ],
    yAxis: {
      title: {
        text: null
      },
      labels: {
        formatter: function (this: Highcharts.AxisLabelsFormatterContextObject): string {
          const value = typeof this.value === 'number' ? this.value : 0

          return Math.abs(value).toString()
        }
      },
      accessibility: {
        description: 'Percentage population',
        rangeDescription: 'Range: 0 to 5%'
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        borderRadius: '50%'
      }
    },
    tooltip: {
      formatter: function (this: any) {
        const count = Math.abs(this.point.y || 0)
        let totalVisitors = 0
        this.series.chart.series.forEach((series: Highcharts.Series) => {
          series.data.forEach((point: Highcharts.Point) => {
            totalVisitors += Math.abs(point.y || 0)
          })
        })
        const overallPercent = totalVisitors ? (count / totalVisitors) * 100 : 0
        let genderTotal = 0
        this.series.data.forEach((point: Highcharts.Point) => {
          genderTotal += Math.abs(point.y || 0)
        })
        const genderPercent = genderTotal ? (count / genderTotal) * 100 : 0
        const genderLabel: string = this.series.name === '남성' ? '전체 남성 대비' : '전체 여성 대비'

        return (
          '<b>' +
          this.series.name +
          ' ' +
          this.point.category +
          '</b><br/>' +
          '방문자수: ' +
          count +
          '명<br/>' +
          genderLabel +
          ': ' +
          genderPercent.toFixed(1) +
          '%<br/>' +
          '전체 방문자 대비: ' +
          overallPercent.toFixed(1) +
          '%'
        )
      }
    },
    series: [
      {
        name: '남성',
        data: [-12, -33, -60, -28, -18, -3, -2]
      },
      {
        name: '여성',
        data: [25, 37, 115, 72, 27, 13, 1]
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default PyramidChart
