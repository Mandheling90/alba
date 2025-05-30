import { format, subDays } from 'date-fns'
import { useCallback, useState } from 'react'
import { ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { ICountBarChart, ICountBarPieChart, ITableData } from 'src/model/statistics/StatisticsModel'

interface UseVisitorReportProps {
  page: EStatisticsPage
  tableType: ETableType
  daysToSubtract?: number
  useSameDay?: boolean
  countBarChart: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: ICountBarChart }>
    isLoading: boolean
  }
  countBarPieChart: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: ICountBarPieChart }>
    isLoading: boolean
  }
  countTable: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: ITableData }>
    isLoading: boolean
  }
}

export const useVisitorReport = ({
  page,
  tableType,
  daysToSubtract = 0,
  useSameDay = false,
  countBarChart,
  countBarPieChart,
  countTable
}: UseVisitorReportProps) => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [barPieChartData, setBarPieChartData] = useState<ICountBarPieChart>()
  const [barTableData, setBarTableData] = useState<ITableData>()
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

      const resPie = await countBarPieChart.mutateAsync(statistics)
      setBarPieChartData(resPie.data)

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
      setBarTableData(tableDataWithKeys)
      setCurrentStatistics(statistics)
    },
    [
      countBarChart.mutateAsync,
      countBarPieChart.mutateAsync,
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
    barPieChartData,
    barTableData,
    fetchData,
    isLoading: countBarChart.isLoading || countBarPieChart.isLoading || countTable.isLoading
  }
}
