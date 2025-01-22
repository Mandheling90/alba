import React from 'react'
import { RangeSelectorButtonTypeValue } from 'src/enum/statisticsEnum'
import { MLineChart } from 'src/model/statistics/StatisticsModel'
import EmptyMsg from '../atom/EmptyMsg'
import GenericChart from './GenericChart'

interface BitcoinChartProps {
  selected: number // 선택된 값
  data: MLineChart[]
  time?: RangeSelectorButtonTypeValue
}

const SmokingChart: React.FC<BitcoinChartProps> = ({ selected, data, time }) => {
  if (data[0]?.statsData.length === 0 || data[1]?.statsData.length === 0 || data.length === 0) {
    return <EmptyMsg message='NoData' height='70%' />
  }

  return (
    <GenericChart
      selected={selected}
      data={data}
      seriesTypes={['line', 'column']}
      colors={['rgba(45, 175, 254, 1)', 'rgba(250, 90, 68, 1)']}
      time={time}
    />
  )
}

export default SmokingChart
