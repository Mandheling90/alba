import { format, subDays } from 'date-fns'
import { useCallback, useState } from 'react'
import { ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import {
  IAgeGenderStatisticsTableResponse,
  ICountBarChart,
  IHeatMapChart,
  IPyramidPieChart
} from 'src/model/statistics/StatisticsModel'

interface UseVisitorAttributesReportProps {
  page: EStatisticsPage
  tableType: ETableType
  daysToSubtract?: number
  useSameDay?: boolean
  countBarChart: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: ICountBarChart }>
    isLoading: boolean
  }
  countPyramidPieChart: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: IPyramidPieChart }>
    isLoading: boolean
  }
  countHeatmapChart: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: IHeatMapChart }>
    isLoading: boolean
  }
  countTable: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: IAgeGenderStatisticsTableResponse }>
    isLoading: boolean
  }
}

export const useVisitorAttributesReport = ({
  page,
  tableType,
  daysToSubtract = 0,
  useSameDay = false,
  countBarChart,
  countPyramidPieChart,
  countHeatmapChart,
  countTable
}: UseVisitorAttributesReportProps) => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [pyramidPieChartData, setPyramidPieChartData] = useState<IPyramidPieChart>()
  const [heatmapChartData, setHeatmapChartData] = useState<IHeatMapChart>()
  const [tableData, setTableData] = useState<IAgeGenderStatisticsTableResponse>()
  const [currentStatistics, setCurrentStatistics] = useState<IStatisticsContextReq>()

  const fetchData = useCallback(
    async (req?: IStatisticsContextReq) => {
      const today = new Date()
      const formattedToday = format(today, 'yyyy-MM-dd')
      const formattedDaysAgo = useSameDay ? formattedToday : format(subDays(today, daysToSubtract), 'yyyy-MM-dd')

      let statistics: IStatisticsContextReq

      if (req) {
        statistics = req
        statisticsReqUpdate({
          ...req,
          page: page
        })
      } else {
        statistics =
          statisticsReq.find(item => item.page === page) ??
          (await statisticsDefultSet({
            startDate: formattedDaysAgo,
            endDate: formattedToday,
            tableType: tableType,
            page: page
          }))
      }

      const res = await countBarChart.mutateAsync(statistics)
      setBarChartData(res.data)

      const resPie = await countPyramidPieChart.mutateAsync(statistics)
      setPyramidPieChartData(resPie.data)

      const resHeatmap = await countHeatmapChart.mutateAsync(statistics)
      setHeatmapChartData(resHeatmap.data)

      const resTableData = await countTable.mutateAsync(statistics)
      const tableDataWithKeys = {
        ...resTableData.data,
        dataList: resTableData.data.dataList.map((item, index) => ({
          ...item,
          key: `table-item-${index}}`,
          dataList: item.dataList?.map((subItem, subIndex) => ({
            ...subItem,
            key: `table-sub-item-${index}-${subIndex}}`
          }))
        }))
      }
      setTableData(tableDataWithKeys)
      setCurrentStatistics(statistics)
    },
    [
      countBarChart.mutateAsync,
      countPyramidPieChart.mutateAsync,
      countHeatmapChart.mutateAsync,
      countTable.mutateAsync,
      page,
      statisticsDefultSet,
      statisticsReqUpdate,
      tableType,
      daysToSubtract,
      useSameDay
    ]
  )

  return {
    currentStatistics,
    barChartData,
    pyramidPieChartData,
    heatmapChartData,
    tableData,
    fetchData,
    isLoading:
      countBarChart.isLoading || countPyramidPieChart.isLoading || countHeatmapChart.isLoading || countTable.isLoading
  }
}
