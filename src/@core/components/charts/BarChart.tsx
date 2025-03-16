import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect } from 'react'

interface IBarChart {
  onHover?: (category: string) => void // 선택된 값
}

const BarChart = ({ onHover }: IBarChart) => {
  const options = {
    chart: {
      type: 'column'
    },

    xAxis: {
      categories: ['남문출입구', '북문출입구', '교육동1층입구', '교육동2층입구'],
      crosshair: true,
      accessibility: {
        description: 'Countries'
      }
    },

    yAxis: {
      min: 0,
      title: {
        text: '방문객수'
      }
    },
    tooltip: {
      valueSuffix: ' (1000 MT)'
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
        name: '전일 방문객',
        data: [387749, 280000, 129000, 64300],
        point: {
          events: {
            mouseOver: function (this: Highcharts.Point) {
              onHover?.(String(this.category)) // 마우스 오버한 데이터 포인트 저장
            },
            mouseOut: function () {
              onHover?.('') // 마우스 아웃 시 빈 문자열 전송
            }
          }
        }
      },
      {
        name: '금일 방문객',
        data: [45321, 140000, 10000, 140500],
        point: {
          events: {
            mouseOver: function (this: Highcharts.Point) {
              onHover?.(String(this.category)) // 마우스 오버한 데이터 포인트 저장
            },
            mouseOut: function () {
              onHover?.('') // 마우스 아웃 시 빈 문자열 전송
            }
          }
        }
      }
    ]
  }

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

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default BarChart
