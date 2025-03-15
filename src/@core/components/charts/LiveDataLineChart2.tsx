import Highcharts from 'highcharts/highstock'
import { useEffect } from 'react'

interface ILiveDataLineChart {
  selected: number // 선택된 값
  data: [number, number][] // 첫 번째 데이터 배열
  secondData: [number, number][] // 두 번째 데이터 배열
  height?: number | string // 차트 높이 (px 또는 %)
}

const LiveDataLineChart2: React.FC<ILiveDataLineChart> = ({ selected, data, secondData, height = '400px' }) => {
  useEffect(() => {
    const chart = Highcharts.stockChart('container', {
      chart: {
        events: {
          load: function () {
            const series = this.series as Highcharts.Series[]
            if (!series || series.length < 2 || !series[0].data || !series[1].data) {
              console.error('Series or series data is undefined or not enough series present')

              return
            }
            setInterval(function () {
              const lastPoint = series[0].data[series[0].data.length - 1]
              const x = lastPoint.x + 1000
              const y1 = Math.random() * 100
              const y2 = Math.random() * 100

              series[0].addPoint([x, y1], false)
              series[1].addPoint([x, y2], true)

              data.push([x, y1])
              secondData.push([x, y2])
            }, 2000)
          }
        }
      },

      time: {
        timezoneOffset: new Date().getTimezoneOffset()
      },
      rangeSelector: {
        selected: 0,
        buttonTheme: {
          width: 50
        },
        buttons: [
          {
            type: 'minute',
            count: 5,
            text: '5 min',
            title: 'View 5 min'
          },
          {
            type: 'minute',
            count: 10,
            text: '10 min',
            title: 'View 10 min'
          },
          {
            type: 'minute',
            count: 15,
            text: '15 min',
            title: 'View 15 min'
          },
          {
            type: 'minute',
            count: 30,
            text: '30 min',
            title: 'View 30 min'
          },
          {
            type: 'minute',
            count: 60,
            text: '60 min',
            title: 'View 60 min'
          }
        ]
      },

      plotOptions: {
        series: {
          turboThreshold: 10000
        }
      },

      navigator: {
        enabled: false
      },

      series: [
        {
          type: 'spline',
          data: data
        },
        {
          type: 'spline',
          data: secondData
        }
      ]
    })

    // setInterval(function () {
    //   chart.series[0].setData(data)
    // }, 5000)
  }, [data, secondData])

  return <div id='container' />
}

export default LiveDataLineChart2
