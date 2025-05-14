import { Box } from '@mui/material'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { memo, useState } from 'react'
import { IPyramidPieChart } from 'src/model/statistics/StatisticsModel'
import { areEqual } from 'src/utils/CommonUtil'
import styled from 'styled-components'
import RoundedBubble from '../atom/RoundedBubble'

const PyramidChart = memo(({ data }: { data: IPyramidPieChart }) => {
  const [hoveredPoint, setHoveredPoint] = useState('')

  // 전체 합계 계산
  const calculateTotal = (data: number[]) => {
    return data.reduce((sum, value) => sum + Math.abs(value), 0)
  }

  // 각 성별의 총합 계산
  const maleTotal = calculateTotal(data.pyramidChart[0].data)
  const femaleTotal = calculateTotal(data.pyramidChart[1].data)
  const total = maleTotal + femaleTotal

  // 각 성별의 비율 계산
  const malePercentage = ((maleTotal / total) * 100).toFixed(1)
  const femalePercentage = ((femaleTotal / total) * 100).toFixed(1)

  const options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: ''
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
        categories: data.categories,
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
        categories: data.categories,
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
        borderRadius: '50%',
        states: {
          inactive: {
            opacity: 0.5
          }
        },
        events: {
          mouseOver: function (this: Highcharts.Series) {
            const chart = this.chart
            setHoveredPoint(this.name)
            setTimeout(() => {
              chart.series.forEach((series: Highcharts.Series) => {
                if (series !== this) {
                  series.setState('inactive')
                }
              })
            }, 10)
          },
          mouseOut: function (this: Highcharts.Series) {
            const chart = this.chart
            setHoveredPoint('')
            chart.series.forEach((series: Highcharts.Series) => {
              series.setState('')
            })
          }
        }
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
        name: data.pyramidChart[0].name,
        data: data.pyramidChart[0].data
      },
      {
        name: data.pyramidChart[1].name,
        data: data.pyramidChart[1].data
      }
    ]
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {hoveredPoint === '여성' && (
        <Box sx={{ position: 'absolute', zIndex: 999, left: '5%', top: '5%' }}>
          <RoundedBubble
            title={'남성전체:'}
            content={`${malePercentage}%`}
            background={'#38A3FA'}
            tailDirection={'5'}
          />
        </Box>
      )}
      {hoveredPoint === '남성' && (
        <Box sx={{ position: 'absolute', zIndex: 999, right: '5%', top: '5%' }}>
          <RoundedBubble
            title={'여성전체:'}
            content={`${femalePercentage}%`}
            background={'#4D3FBA'}
            tailDirection={'7'}
          />
        </Box>
      )}

      <ChartWrapper>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </ChartWrapper>
    </Box>
  )
}, areEqual)

PyramidChart.displayName = 'PyramidChart'

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`

export default PyramidChart
