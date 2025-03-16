import { Box } from '@mui/material'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useState } from 'react'
import RoundedBubble from '../atom/RoundedBubble'

// Age categories
const categories = ['10대 이하', '10대', '20대', '30대', '40대', '50대', '60대 이상']

const PyramidChart = ({}) => {
  const [hoveredPoint, setHoveredPoint] = useState('')

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
        borderRadius: '50%',
        states: {
          inactive: {
            opacity: 0.5 // 마우스 오버 시 반대쪽 차트의 불투명도 조정
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
        name: '남성',
        data: [-12, -33, -60, -28, -18, -3, -2],
        point: {
          events: {
            mouseOver: function (this: Highcharts.Point) {
              setHoveredPoint('남성') // 마우스 오버한 데이터 포인트 저장
            },
            mouseOut: function () {
              setHoveredPoint('') // 마우스 아웃 시 빈 문자열 전송
            }
          }
        }
      },
      {
        name: '여성',
        data: [25, 37, 115, 72, 27, 13, 1],
        point: {
          events: {
            mouseOver: function (this: Highcharts.Point) {
              setHoveredPoint('여성') // 마우스 오버한 데이터 포인트 저장
            },
            mouseOut: function () {
              setHoveredPoint('') // 마우스 아웃 시 빈 문자열 전송
            }
          }
        }
      }
    ]
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {hoveredPoint === '여성' && (
        <Box sx={{ position: 'absolute', zIndex: 999, left: '5%', top: '15%' }}>
          <RoundedBubble title={'남성전체:'} content={'30.1%'} background={'#38A3FA'} tailDirection={'5'} />
        </Box>
      )}
      {hoveredPoint === '남성' && (
        <Box sx={{ position: 'absolute', zIndex: 999, right: '5%', top: '15%' }}>
          <RoundedBubble title={'여성전체:'} content={'30.1%'} background={'#4D3FBA'} tailDirection={'7'} />
        </Box>
      )}

      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  )
}

export default PyramidChart
