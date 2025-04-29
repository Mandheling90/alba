import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect } from 'react'
import { ICountBarChart } from 'src/model/statistics/StatisticsModel'

interface IBarChart {
  onHover?: (category: string) => void // 선택된 값
  data?: ICountBarChart
}

const BarChart = ({ onHover, data }: IBarChart) => {
  const options = {
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
        name: data?.barDataList[0].name,
        data: data?.barDataList[0].dataList,
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
        name: data?.barDataList[1].name,
        data: data?.barDataList[1].dataList,
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
