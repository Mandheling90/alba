import Highcharts from 'highcharts/highstock'
import { memo, useEffect, useRef } from 'react'
import { ICountLineChartPolling, ILineDataList } from 'src/model/statistics/StatisticsModel'
import { areEqual } from 'src/utils/CommonUtil'
import styled from 'styled-components'

declare module 'highcharts' {
  interface Series {
    pulse?: any
    markerGroup?: any
  }
}

interface ILiveDataLineChart {
  selected: number // 선택된 값
  data: ILineDataList[]

  // secondData: { timestamp: number; count: number }[] // 두 번째 데이터 배열
  height?: number | string // 차트 높이 (px 또는 %)
  livePollingMutate: (params: { lastDate: string; lastTime: string }) => Promise<any>
  onTimeStrChange?: (timeStr: string) => void // timeStr 변경 시 호출될 콜백 함수
}

const LiveDataLineChart = memo(
  ({ selected, data, height = '400px', livePollingMutate, onTimeStrChange }: ILiveDataLineChart) => {
    const intervalIdRef = useRef<NodeJS.Timeout>()

    // 데이터 형식 변환 함수
    const convertDataFormat = (data: { timestamp: number; count: number }[]): [number, number][] => {
      return data.map(item => [item.timestamp, item.count])
    }

    const convertedData = data?.[0]?.dataList ? convertDataFormat(data[0].dataList) : []
    const convertedSecondData = data?.[1]?.dataList ? convertDataFormat(data[1].dataList) : []

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
      // 펄스 효과를 위한 이벤트 핸들러 추가
      Highcharts.addEvent(
        Highcharts.Series,
        'addPoint',
        (e: { point: Highcharts.Point; target: Highcharts.Series }) => {
          const point = e.point,
            series = e.target

          if (!series.pulse) {
            series.pulse = series.chart.renderer.circle().add(series.markerGroup)
          }

          setTimeout(() => {
            series.pulse
              .attr({
                x: series.xAxis.toPixels(point.x ?? 0, true),
                y: series.yAxis.toPixels(point.y ?? 0, true),
                r: 2,
                opacity: 1,
                fill: series.color
              })
              .animate(
                {
                  r: 20,
                  opacity: 0
                },
                {
                  duration: 1000
                }
              )
          }, 1)
        }
      )

      const chart = Highcharts.stockChart('container', {
        chart: {
          events: {
            load: function () {
              const series = this.series as Highcharts.Series[]
              if (
                !series ||
                series.length < 2 ||
                !series[0].data ||
                !series[1].data ||
                !convertedData ||
                !convertedSecondData
              ) {
                console.error('Series or series data is undefined or not enough series present')

                return
              }

              intervalIdRef.current = setInterval(async function () {
                if (!convertedData || convertedData.length === 0) {
                  console.error('No data available in convertedData')

                  return
                }

                const lastTimestamp = convertedData[convertedData.length - 1][0]

                const date = new Date(lastTimestamp)
                const dateStr =
                  date.getFullYear().toString() +
                  (date.getMonth() + 1).toString().padStart(2, '0') +
                  date.getDate().toString().padStart(2, '0') // YYYYMMDD 형식
                const timeStr =
                  date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') // HHMM 형식

                onTimeStrChange?.(timeStr.slice(0, 2)) // timeStr이 변경될 때마다 콜백 함수 호출

                const lastPoint = await livePollingMutate({
                  lastDate: dateStr,
                  lastTime: timeStr
                })

                if (
                  !lastPoint?.data ||
                  !Array.isArray(lastPoint.data.lineDataList) ||
                  lastPoint.data.lineDataList.length === 0
                ) {
                  console.error('No response from livePollingMutate')

                  return
                }

                const lastPointData: ICountLineChartPolling = lastPoint.data

                const previousData = lastPointData.lineDataList[0].data
                const currentData = lastPointData.lineDataList[1].data

                series[0]?.addPoint([previousData.timestamp, previousData.count], false)
                series[1]?.addPoint([currentData.timestamp, currentData.count], true)

                // x축 범위 자동 조정
                const xAxis = chart.xAxis[0]
                const currentExtremes = xAxis.getExtremes()
                const newMax = Math.max(currentData.timestamp, previousData.timestamp)

                // 현재 보이는 범위의 끝에서 80% 이상 지났을 때만 자동 스크롤
                if (newMax > currentExtremes.max * 0.8) {
                  const range = currentExtremes.max - currentExtremes.min
                  xAxis.setExtremes(newMax - range, newMax)
                }

                convertedData.push([previousData.timestamp, previousData.count])
                convertedSecondData.push([currentData.timestamp, currentData.count])
              }, 30000)
            }
          }
        },
        time: {
          timezoneOffset: new Date().getTimezoneOffset()
        },
        rangeSelector: {
          selected: 2,
          buttonTheme: {
            width: 50
          },
          buttons: [
            {
              type: 'minute',
              count: 5,
              text: '5분',
              title: '5분 보기'
            },
            {
              type: 'minute',
              count: 15,
              text: '15분',
              title: '15분 보기'
            },
            {
              type: 'minute',
              count: 30,
              text: '30분',
              title: '30분 보기'
            },
            {
              type: 'hour',
              count: 1,
              text: '1시간',
              title: '1시간 보기'
            },
            {
              type: 'hour',
              count: 4,
              text: '4시간',
              title: '4시간 보기'
            }
          ]
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
          maxPadding: 0.1,
          crosshair: true,
          minRange: 240 * 60 * 1000,
          min: data[0]?.dataList[0]?.timestamp,
          max: data[0]?.dataList[data[0].dataList.length - 1]?.timestamp
        },
        yAxis: {
          opposite: false,
          title: {
            text: '방문객수'
          },
          min: 0,

          // softMax: 100,
          allowDecimals: false,
          tickInterval: 10
        },
        tooltip: {
          headerFormat: '<b>{point.x:%m월%d일 %H:%M}</b><br/>',
          pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:,.0f}명</b><br/>',
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
            data: convertedData || [],
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
            data: convertedSecondData || [],
            turboThreshold: 0
          }
        ]
      })

      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current)
        }
        if (chart) {
          chart.destroy()
        }
      }
    }, [convertedData, convertedSecondData])

    return (
      <ChartWrapper>
        <div id='container' />
      </ChartWrapper>
    )
  },
  areEqual
)

LiveDataLineChart.displayName = 'LiveDataLineChart'

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`

export default LiveDataLineChart
