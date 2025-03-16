import Highcharts from 'highcharts/highstock'
import { useEffect } from 'react'

interface ILiveDataLineChart {
  selected: number // 선택된 값
  data: [number, number][] // 첫 번째 데이터 배열
  secondData: [number, number][] // 두 번째 데이터 배열
  height?: number | string // 차트 높이 (px 또는 %)
}

const LiveDataLineChart: React.FC<ILiveDataLineChart> = ({ selected, data, secondData, height = '400px' }) => {
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .highcharts-range-selector-group {
        display: none;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const chart = Highcharts.stockChart('container', {
      chart: {
        events: {
          load: function () {
            const series = this.series as Highcharts.Series[]
            if (!series || series.length < 2 || !series[0].data || !series[1].data || !data || !secondData) {
              console.error('Series or series data is undefined or not enough series present')

              return
            }
            setInterval(function () {
              const lastPoint = series[0]?.data[series[0].data.length - 1]
              if (!lastPoint) {
                console.error('Last point is undefined')

                return
              }
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
            count: 1,
            text: '1 min',
            title: 'View 1 min'
          }
        ]
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        maxPadding: 0.1,
        crosshair: true
      },
      yAxis: {
        opposite: false,
        title: {
          text: '방문객수'
        },
        min: 0,
        max: 100
      },
      tooltip: {
        headerFormat: '<b>{point.x:%m월%d일 %H:%M}</b><br/>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:.1f}</b><br/>',
        shared: true
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4
          }
        }
      },
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'top',
        useHTML: true
      },
      navigator: {
        enabled: false
      },

      series: [
        {
          type: 'spline',
          name: '전일 방문객',
          marker: {
            symbol: 'circle'
          },
          lineWidth: 2,
          color: '#87CEEB',
          data: data || [],
          turboThreshold: 0
        },
        {
          type: 'spline',
          name: '금일 방문객',
          marker: {
            symbol: 'square'
          },
          lineWidth: 2,
          color: '#00008B',
          data: secondData || [],
          turboThreshold: 0
        }
      ]
    })
  }, [data, secondData])

  return <div id='container' />
}

export default LiveDataLineChart
