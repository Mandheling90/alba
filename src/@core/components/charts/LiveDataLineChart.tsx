import Highcharts from 'highcharts/highstock'
import React, { useEffect, useRef } from 'react'

// 샘플 데이터 생성 함수
const generateSampleData = (count = 20): [number, number][] => {
  const data: [number, number][] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    data.push([now - (count - i) * 1000, Math.random() * 100])
  }

  return data
}

// 사용 예시 컴포넌트
export const LiveDataLineChartExample: React.FC = () => {
  const initialData = generateSampleData()
  const initialData2 = generateSampleData()

  return <LiveDataLineChart selected={1} data={initialData} secondData={initialData2} />
}

interface ILiveDataLineChart {
  selected: number // 선택된 값
  data: [number, number][] // 첫 번째 데이터 배열
  secondData: [number, number][] // 두 번째 데이터 배열
  height?: number | string // 차트 높이 (px 또는 %)
}

const LiveDataLineChart: React.FC<ILiveDataLineChart> = ({ selected, data, secondData, height = '400px' }) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Add id to the div element
    chartRef.current.id = 'highcharts-container'

    const options: Highcharts.Options = {
      chart: {
        renderTo: chartRef.current,
        type: 'spline',
        height: height
      },

      time: {
        useUTC: false
      },

      title: {
        text: 'Live random data'
      },

      accessibility: {
        announceNewData: {
          enabled: true,
          minAnnounceInterval: 15000,
          announcementFormatter: function (allSeries, newSeries, newPoint) {
            if (newPoint) {
              return 'New point added. Value: ' + newPoint.y
            }

            return false
          }
        }
      },

      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        maxPadding: 0.1
      },

      yAxis: {
        title: {
          text: 'Value'
        },
        min: 0,
        max: 100
      },

      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
      },

      legend: {
        enabled: true
      },

      exporting: {
        enabled: false
      },

      plotOptions: {
        series: {
          marker: {
            enabled: true
          }
        }
      },

      series: [
        {
          type: 'spline',
          name: 'Random data 1',
          lineWidth: 2,
          color: '#87CEEB',
          data: data || [],
          turboThreshold: 0
        },
        {
          type: 'spline',
          name: 'Random data 2',
          lineWidth: 2,
          color: '#00008B',
          data: secondData || [],
          turboThreshold: 0
        }
      ]
    }

    const chart = Highcharts.chart(options)

    const intervalId = setInterval(() => {
      if (!chart || !chart.series || chart.series.length < 2) return

      const x = new Date().getTime()
      const y1 = Math.random() * 100
      const y2 = Math.random() * 100

      chart.series[0].addPoint([x, y1], false)
      chart.series[1].addPoint([x, y2], true)
    }, 1000)

    return () => {
      clearInterval(intervalId)
      chart.destroy()
    }
  }, [data, secondData])

  return <div ref={chartRef} />
}

export default LiveDataLineChart
