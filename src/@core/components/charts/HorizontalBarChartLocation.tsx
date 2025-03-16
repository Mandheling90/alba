import Highcharts, { Chart as ChartType } from 'highcharts'
import { useEffect, useRef } from 'react'
import SwitchCustom from '../atom/SwitchCustom'

const HorizontalBarChartLocation = () => {
  const chartRef = useRef<ChartType | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      chartRef.current = Highcharts.chart({
        chart: {
          renderTo: 'location-chart-container',
          type: 'spline',

          // height: 500,
          events: {
            load: function (this: ChartType) {
              // 차트 로드 시 첫 번째 시리즈에 대해 마우스오버 상태를 적용
              if (this.series && this.series.length > 0) {
                this.series[0].onMouseOver()
              }
            }
          }
        },

        // title: {
        //   text: '시간대별 방문자 수',
        //   align: 'left'
        // },

        // subtitle: {
        //   text: '7개 장소별 방문자 수'
        // },
        legend: {
          enabled: true,
          align: 'right',
          verticalAlign: 'top',
          useHTML: true
        },
        xAxis: {
          type: 'datetime',
          tickInterval: 3600 * 1000, // 1시간 간격
          dateTimeLabelFormats: {
            hour: '%H시'
          },
          min: Date.UTC(2025, 0, 1, 0, 0, 0),
          max: Date.UTC(2025, 0, 1, 23, 0, 0),
          title: {
            text: '시간'
          }
        },
        yAxis: {
          title: {
            text: '방문자 수'
          },
          allowDecimals: false,
          min: 0
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.x:%H시}: {point.y}명'
        },
        plotOptions: {
          series: {
            marker: {
              symbol: 'circle',
              fillColor: '#FFFFFF',
              enabled: true,
              radius: 2.5,
              lineWidth: 1,
              lineColor: undefined
            },
            states: {
              hover: {
                enabled: true,
                lineWidth: 3
              },
              inactive: {
                enabled: true,
                opacity: 0.3
              }
            }
          }
        },
        colors: ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3', '#F3FF33', '#FF33A8'],
        series: (function () {
          const series = []
          const placeNames = ['교육동2층', '식물원입구', '농업관01', '농업관02', '어린이박물관', '기획전시실', '북문']
          const baseTime = Date.UTC(2025, 0, 1, 0, 0, 0)

          // 각 장소별 방문자 패턴 설정
          const patterns = [
            { min: 50, max: 200 }, // 교육동2층
            { min: 30, max: 150 }, // 식물원입구
            { min: 20, max: 100 }, // 농업관01
            { min: 25, max: 120 }, // 농업관02
            { min: 40, max: 180 }, // 어린이박물관
            { min: 35, max: 160 }, // 기획전시실
            { min: 15, max: 80 } // 북문
          ]

          for (let i = 0; i < placeNames.length; i++) {
            const data = []
            const pattern = patterns[i]

            for (let hour = 0; hour < 24; hour++) {
              const time = baseTime + hour * 3600 * 1000

              // 시간대별 방문자 패턴 적용
              let visitors
              if (hour >= 9 && hour <= 17) {
                // 성수기 시간대 (9시-17시)
                visitors = Math.floor(Math.random() * (pattern.max - pattern.min)) + pattern.min
              } else if (hour < 6 || hour >= 22) {
                // 심야 시간대 (22시-6시)
                visitors = Math.floor(Math.random() * 20)
              } else {
                // 그 외 시간대
                visitors = Math.floor(Math.random() * (pattern.min - 10)) + 10
              }

              data.push([time, visitors])
            }

            series.push({
              type: 'spline' as const,
              name: placeNames[i],
              data: data,
              lineWidth: 2,
              visible: true
            })
          }

          return series
        })()
      })
    }
  }, [])

  const handleSwitchChange = (selected: boolean) => {
    if (chartRef.current) {
      chartRef.current.series.forEach((s: Highcharts.Series) => {
        s.setVisible(selected, false)
      })
      chartRef.current.redraw()
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <style>
        {`
          .highcharts-title {
            display: none;
          }
        `}
      </style>
      <div id='location-chart-container' style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '10px', left: '50px' }}>
        <SwitchCustom
          width={90}
          switchName={['전체', '개별']}
          activeColor={['rgba(145, 85, 253, 1)', 'rgba(145, 85, 253, 1)']}
          selected={true}
          superSelected={false}
          onChange={selected => handleSwitchChange(selected)}
        />
      </div>
    </div>
  )
}

export default HorizontalBarChartLocation
