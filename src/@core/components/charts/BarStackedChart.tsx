import Highcharts from 'highcharts'
import React, { useEffect } from 'react'
import { ICountBarChart } from 'src/model/statistics/StatisticsModel'

const BarStackedChart: React.FC<{ data: ICountBarChart }> = ({ data }) => {
  useEffect(() => {
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
        categories: data.xcategories,
        title: {
          text: data.xtitle
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: data.ytitle
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
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'top',
        useHTML: true
      },
      series: [
        {
          type: 'column',
          name: data.chartDataList[0].name,
          data: data.chartDataList[0].dataList,
          color: '#544FC5',
          pointPlacement: -0.2
        },
        {
          type: 'column',
          name: data.chartDataList[1].name,
          data: data.chartDataList[1].dataList,
          color: '#2CAFFE'
        }
      ]
    })
  }, [data])

  return <div id='container' style={{ height: '400px', width: '100%' }} />
}

export default BarStackedChart
