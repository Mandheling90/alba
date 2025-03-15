import Highcharts from 'highcharts'
import React, { useEffect } from 'react'

const BarStackedChart: React.FC = () => {
  useEffect(() => {
    // 24시간 데이터를 생성하는 함수.
    const generateHourlyData = () => {
      const data = []
      for (let hour = 0; hour < 24; hour++) {
        if ((hour >= 0 && hour <= 6) || (hour >= 21 && hour <= 23)) {
          data.push(0)
        } else {
          data.push(Math.floor(Math.random() * 91) + 10) // 10~100 사이의 랜덤 값
        }
      }

      return data
    }

    // 입장객과 퇴장객 데이터 생성
    const entranceData = generateHourlyData()
    const exitData = generateHourlyData()

    // 0시부터 23시까지 카테고리 배열 생성
    const hourCategories = Array.from({ length: 24 }, (_, i) => i + '시')

    // 하이차트 차트 생성 (중첩된 형태)
    Highcharts.chart({
      chart: {
        renderTo: 'container',
        type: 'column'
      },
      title: {
        text: '24시간 입장자 및 퇴장자 비교'
      },
      xAxis: {
        categories: hourCategories,
        title: {
          text: '시간'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: '방문객 수'
        }
      },
      tooltip: {
        shared: true,
        headerFormat: '<b>{point.key}</b><br/>'
      },
      plotOptions: {
        column: {
          grouping: false,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y === 0 ? '' : this.y
            }
          }
        }
      },
      series: [
        {
          type: 'column',
          name: '입장객',
          data: entranceData,
          color: '#544FC5',
          pointPlacement: -0.2
        },
        {
          type: 'column',
          name: '퇴장객',
          data: exitData,
          color: '#2CAFFE'
        }
      ]
    })
  }, [])

  return <div id='container' style={{ height: '400px', width: '100%' }} />
}

export default BarStackedChart
