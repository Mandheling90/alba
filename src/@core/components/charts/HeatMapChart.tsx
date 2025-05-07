import React, { useEffect, useState } from 'react'
import { IHeatMapChart } from 'src/model/statistics/StatisticsModel'

// Highcharts 모듈을 동적으로 로드
let Highcharts: any
let HeatmapModule: any

if (typeof window !== 'undefined') {
  import('highcharts').then(module => {
    Highcharts = module.default
    import('highcharts/modules/heatmap').then(heatmapModule => {
      HeatmapModule = heatmapModule.default || heatmapModule
      if (typeof HeatmapModule === 'function') {
        HeatmapModule(Highcharts)
      }
    })
  })
}

const HeatMapChart: React.FC<{ data: IHeatMapChart }> = ({ data }) => {
  const [HighchartsReact, setHighchartsReact] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('highcharts')
        .then(module => {
          Highcharts = module.default
          import('highcharts/modules/heatmap')
            .then(heatmapModule => {
              HeatmapModule = heatmapModule.default || heatmapModule
              if (typeof HeatmapModule === 'function') {
                HeatmapModule(Highcharts)
              }
              import('highcharts-react-official').then(module => {
                setHighchartsReact(() => module.default)
              })
            })
            .catch(error => {
              console.error('Error loading heatmap module:', error)
            })
        })
        .catch(error => {
          console.error('Error loading Highcharts:', error)
        })
    }
  }, [])

  useEffect(() => {
    if (Highcharts) {
      Highcharts.setOptions({
        time: {
          timezoneOffset: -9 * 60 // KST 적용 (UTC+9)
        }
      })
    }
  }, [Highcharts])

  const options: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1
    },
    title: {
      text: '시간별 연령별 방문자수 및 성별 비율',
      style: {
        fontSize: '1em'
      }
    },
    xAxis: {
      categories: data.xaxisCategories
    },
    yAxis: {
      categories: data.yaxisCategories,
      title: undefined,
      reversed: true
    },
    accessibility: {
      point: {
        descriptionFormat:
          '{(add index 1)}. ' + '{series.xAxis.categories.(x)} sales ' + '{series.yAxis.categories.(y)}, {value}.'
      }
    },
    colorAxis: {
      min: 0,
      max: Math.max(...data.dataList.map(item => item.value)),
      stops: [
        [0, '#B9EEFF'],
        [0.4, '#7FACFF'],
        [0.7, '#FF97A6'],
        [1, '#FF0000']
      ]
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280
    },
    tooltip: {
      formatter: function (this: any) {
        const formatPercentage = (value: number) => {
          if (!this.visitors || this.visitors === 0) return 0
          const percentage = (value / this.visitors) * 100

          return Number.isInteger(percentage) ? percentage : percentage.toFixed(1)
        }

        return `<b>시간대: ${this.series.xAxis.categories[this.x]}</b><br>
                <b>연령: ${this.series.yAxis.categories[this.y]}</b><br>
                방문자수: ${this.visitors || 0}<br>
                남성: ${this.male}명(${formatPercentage(this.male || 0)})%<br>
                여성: ${this.female}명(${formatPercentage(this.female || 0)})%`
      }
    },
    series: [
      {
        type: 'heatmap',
        name: data.title,
        borderWidth: 1,
        data: data.dataList,
        dataLabels: {
          enabled: true,
          color: '#000000',
          formatter: function (this: any) {
            return `${this.point.visitors}<br>(${this.point.male}%, ${this.point.female}%)`
          }
        }
      }
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            yAxis: {
              labels: {
                format: '{substr value 0 1}'
              }
            }
          }
        }
      ]
    }
  }

  return Highcharts && HighchartsReact ? <HighchartsReact highcharts={Highcharts} options={options} /> : null
}

export default HeatMapChart
