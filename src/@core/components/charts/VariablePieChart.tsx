import Highcharts from 'highcharts'
import React, { useEffect } from 'react'
import { MPieChart } from 'src/model/statistics/StatisticsModel'
import { formatNumberWithCommas } from 'src/utils/CommonUtil'
import styled from 'styled-components'

interface DataItem {
  name: string
  y: number
  z?: number
  count: number
  color?: string
}

const updateZValues = (data: MPieChart[]): DataItem[] => {
  // 1. color가 있는 객체 필터링
  const coloredData = data.filter(item => item.color)

  // 2. count 값을 기준으로 정렬
  const sortedColoredData = [...coloredData].sort((a, b) => b.y - a.y)

  // 3. 상위, 중위, 하위 33% 구간 나누기
  const oneThird = Math.floor(sortedColoredData.length / 3)

  // 상위 33%는 z를 4로, 중위 33%는 z를 3으로, 하위 33%는 z를 2로 설정
  sortedColoredData.forEach((item, index) => {
    item.z = index < oneThird ? 4 : index < oneThird * 2 ? 3 : 2
  })

  // 4. 원래 데이터에 업데이트된 z값 반영
  const updatedData = data.map(item => {
    const coloredItem = sortedColoredData.find(colored => colored.name === item.name)
    const dataItem: DataItem = {
      name: item.name,
      y: item.y,
      count: item.count,
      color: item.color || 'rgba(115, 184, 255, 1)'
    }

    return coloredItem ? { ...dataItem, z: coloredItem.z } : { ...dataItem, z: 1 }
  })

  // 5. name을 기준으로 정렬하여 반환
  return updatedData.sort((a, b) => a.name.localeCompare(b.name))
}

interface IVariablePieChart {
  data: MPieChart[]
}

// 파이차트에서는 y가 흡연자 count가 유동인구
const VariablePieChart: React.FC<IVariablePieChart> = ({ data }) => {
  useEffect(() => {
    // 총 유동인구 합산
    const totalPopulation = data.reduce((acc, item) => acc + item.y, 0)

    // 총 흡연자 합산
    // const totalSmokers = data.reduce((acc, item) => acc + item.count, 0)

    // 데이터 개수
    const dataLength = data.length

    // 유동인구 평균 계산
    const avgPopulation = totalPopulation / dataLength

    // 흡연자 평균 계산
    // const avgSmokers = totalSmokers / dataLength

    import('highcharts/modules/variable-pie').then(module => {
      module.default(Highcharts)

      if (Highcharts?.chart) {
        // @ts-ignore
        Highcharts.chart('variable-pie-container', {
          chart: {
            type: 'variablepie'
          },

          title: {
            text: `전체 <b class='title-number'>${formatNumberWithCommas(
              Math.round(totalPopulation)
            )}</b>명 <br /> 평균 <b class='title-number'>${formatNumberWithCommas(
              Math.round(avgPopulation || 0)
            )}</b>명`,
            verticalAlign: 'middle',
            floating: true,
            style: {
              fontSize: '14px'
            }
          },

          tooltip: {
            enabled: false,
            headerFormat: '',
            pointFormat:
              '<span style="color:{point.color}">\u25CF</span> <b> ' +
              '{point.name}</b><br/>' +
              'Area (square km): <b>{point.y}</b><br/>' +
              'Population density (people per square km): <b>{point.z}</b><br/>'
          },

          plotOptions: {
            series: {
              dataLabels: [
                {
                  enabled: true,
                  format: '{point.name} <br /> {point.percentage:.1f}% {point.y}명',
                  distance: 20
                },
                {
                  enabled: true,
                  distance: -80,
                  format: '{point.percentage:.1f}%',
                  style: {
                    fontSize: '10px',
                    textOutline: 'none',
                    opacity: 0.7
                  },
                  filter: {
                    operator: '>',
                    property: 'percentage',
                    value: 10
                  }
                }
              ],
              colors: ['rgba(115, 184, 255, 1)'] // 기본 색상 설정
            }
          },

          series: [
            {
              allowDrillToNode: true,
              type: 'variablepie',
              minPointSize: 10,
              innerSize: '40%',
              zMin: 0,
              name: 'countries',
              data: updateZValues(data),
              size: '100%'
            }
          ]
        })
      }
    })
  }, [data])

  return (
    <ChartWrapper>
      <div id='variable-pie-container' style={{ width: '100%' }} />
    </ChartWrapper>
  )
}

const ChartWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  .title-number {
    font-size: 18px;
  }

  .highcharts-credits {
    display: none;
  }
`

export default VariablePieChart
