import React, { useEffect, useState } from 'react'
import { IHeatMapChart } from 'src/model/statistics/StatisticsModel'
import { categoryPercentage } from 'src/utils/CommonUtil'
import styled from 'styled-components'

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
      plotBorderWidth: 1,
      ...(data.xaxisCategories.length >= Number(process.env.NEXT_PUBLIC_CHART_SCROLL_COUNT) && {
        scrollablePlotArea: {
          minWidth: data.xaxisCategories.length * 50,
          scrollPositionX: 0
        }
      })
    },
    title: {
      text: ''

      // style: {
      //   fontSize: '1em'
      // }
    },
    xAxis: {
      categories: data.xaxisCategories,
      labels: {
        style: {
          fontSize:
            data.xaxisCategories.length > 20
              ? '10px'
              : data.xaxisCategories.length > 15
              ? '10px'
              : data.xaxisCategories.length > 10
              ? '12px'
              : '14px'
        }
      }
    },
    yAxis: {
      categories: data.yaxisCategories,
      title: undefined,
      reversed: true,
      labels: {
        style: {
          fontSize:
            data.xaxisCategories.length > 20
              ? '10px'
              : data.xaxisCategories.length > 15
              ? '10px'
              : data.xaxisCategories.length > 10
              ? '12px'
              : '14px'
        }
      }
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
                방문자수: ${(this.visitors || 0).toLocaleString()}<br>
                남성: ${(this.male || 0).toLocaleString()}명(${formatPercentage(this.male || 0)}%)<br>
                여성: ${(this.female || 0).toLocaleString()}명(${formatPercentage(this.female || 0)}%)`
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
          allowOverlap: true,
          style: {
            fontSize:
              data.xaxisCategories.length > Number(process.env.NEXT_PUBLIC_CHART_SCROLL_COUNT)
                ? '8px'
                : data.xaxisCategories.length > 20
                ? '8px'
                : data.xaxisCategories.length > 15
                ? '8px'
                : data.xaxisCategories.length > 10
                ? '10px'
                : '12px'
          },
          formatter: function (this: any) {
            return `${(this.point.visitors || 0).toLocaleString()}<br>(${categoryPercentage(
              this.point.visitors,
              this.point.male || 0
            )}%, ${categoryPercentage(this.point.visitors, this.point.female || 0)}%)`
          }
        }
      }
    ],
    responsive: {
      // rules: [
      //   {
      //     condition: {
      //       maxWidth: 500
      //     },
      //     chartOptions: {
      //       series: [
      //         {
      //           type: 'heatmap',
      //           dataLabels: {
      //             style: {
      //               fontSize: '8px'
      //             }
      //           }
      //         }
      //       ],
      //       yAxis: {
      //         labels: {
      //           format: '{substr value 0 1}'
      //         }
      //       }
      //     }
      //   },
      //   {
      //     condition: {
      //       minWidth: 501,
      //       maxWidth: 800
      //     },
      //     chartOptions: {
      //       series: [
      //         {
      //           type: 'heatmap',
      //           dataLabels: {
      //             style: {
      //               fontSize: '8px'
      //             }
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     condition: {
      //       minWidth: 801
      //     },
      //     chartOptions: {
      //       series: [
      //         {
      //           type: 'heatmap',
      //           dataLabels: {
      //             style: {
      //               fontSize: '8px'
      //             }
      //           }
      //         }
      //       ]
      //     }
      //   }
      // ]
    }
  }

  return Highcharts && HighchartsReact ? (
    <ChartWrapper>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ChartWrapper>
  ) : null
}

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`

export default HeatMapChart
