import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more'
import React from 'react'
import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import styled from 'styled-components'

// Highcharts-more 모듈 로드 (arearange를 사용하기 위해 필요)
if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts)
}

Highcharts.setOptions({
  global: {
    // useUTC 제거
  }
})

interface IAreaRangeLineChart {
  kioskStatus?: KIOSK_STATUS
  arearangeData: any[]
  lineData: any[]
}

const AreaRangeLineChart: React.FC<IAreaRangeLineChart> = ({
  kioskStatus = KIOSK_STATUS.ENABLED,
  arearangeData,
  lineData
}) => {
  const options: Highcharts.Options = {
    time: {
      timezoneOffset: 540 // KST의 오프셋 (9시간 * 60분)
    },
    chart: {
      height: '250vh',
      backgroundColor:
        kioskStatus === KIOSK_STATUS.ERROR ? '#ffcc80' : kioskStatus === KIOSK_STATUS.DISABLED ? '#e0e0e0' : '#ffffff'
    },
    title: {
      text: undefined
    },
    subtitle: {
      text: '인원수'
    },
    xAxis: {
      type: 'datetime',
      crosshair: true,
      labels: {
        format: '{value:%H:%M}' // 시간 포맷 설정
      },
      tickInterval: 3600000, // 1시간 간격 (3600000 밀리초)
      lineWidth: 1 // X축 라인이 항상 보이게 설정
    },
    yAxis: {
      title: {
        text: null
      },
      lineWidth: 1 // Y축 라인이 항상 보이게 설정
    },
    tooltip: {
      shared: true,
      valueSuffix: '°C',
      formatter: function () {
        const startDate = new Date(Number(this.x))
        const endDate = new Date(Number(this.x) + 3600000) // 1시간 후

        // 날짜 및 시간 포맷팅
        const formatDate = (date: Date) =>
          `${date.getFullYear()}년<b>${date.getMonth() + 1}</b>월<b>${date.getDate()}</b>일`

        const formatHourRange = (start: Date, end: Date) =>
          `<b>${String(start.getHours()).padStart(2, '0')}</b>-<b>${String(end.getHours()).padStart(2, '0')}</b>시`

        const dateStr = `${formatDate(startDate)} (${formatHourRange(startDate, endDate)})`

        const range = (this as any).points?.[0]
        const avg = (this as any).points?.[1]

        return `
          ${dateStr}<br/>
          유동인구: <b>${range?.point.high}</b>명 <br/>
          흡연자수: <b>${avg?.y}</b>명
        `
      }
    },
    legend: {
      enabled: false // 범례를 완전히 숨김
    },
    series: [
      {
        name: 'Temperature Range',
        type: 'arearange',
        data: arearangeData,
        color: 'rgba(44, 175, 254, 0.5)', // 투명한 색상으로 area range 표시
        fillOpacity: 0.3,
        lineWidth: 0,
        linkedTo: ':previous',
        zIndex: 0,
        marker: {
          enabled: false
        }
      },
      {
        name: 'Average Temperature',
        type: 'line',
        data: lineData,
        color: '#2caffe' // 라인 색상
      }
    ]
  }

  return (
    <HighchartsWrapper>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </HighchartsWrapper>
  )
}

const HighchartsWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`

export default AreaRangeLineChart
