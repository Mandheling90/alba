import { format, subDays } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import VisitorTemplate from 'src/@core/components/charts/template/VisitorTemplate'
import { ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { ICountBarChart, ICountBarPieChart, ITableData } from 'src/model/statistics/StatisticsModel'
import {
  useCountWeekDayBarChart,
  useCountWeekDayBarPieChart,
  useCountWeekDayTable
} from 'src/service/statistics/statisticsService'

const VisitorReportWeekDay: FC = (): React.ReactElement => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const { mutateAsync: countBarChart, isLoading: countBarChartLoading } = useCountWeekDayBarChart()
  const { mutateAsync: countBarPieChart, isLoading: countBarPieChartLoading } = useCountWeekDayBarPieChart()
  const { mutateAsync: countTable, isLoading: countTableLoading } = useCountWeekDayTable()

  const page = EStatisticsPage.WEEK_DAY
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [barPieChartData, setBarPieChartData] = useState<ICountBarPieChart>()
  const [barTableData, setBarTableData] = useState<ITableData>()

  const fetchData = useCallback(
    async (req?: IStatisticsContextReq) => {
      const today = new Date()
      const threeDaysAgo = subDays(today, 6)
      const formattedToday = format(today, 'yyyy-MM-dd')
      const formattedThreeDaysAgo = format(threeDaysAgo, 'yyyy-MM-dd')

      const statistics =
        req ||
        (await statisticsDefultSet({
          startDate: formattedThreeDaysAgo,
          endDate: formattedToday,
          tableType: ETableType.WEEKDAY,
          page: page
        }))

      const res = await countBarChart(statistics)
      setBarChartData(res.data)

      const resPie = await countBarPieChart(statistics)
      setBarPieChartData(resPie.data)

      const resTableData = await countTable(statistics)
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

      if (req) {
        statisticsReqUpdate({
          ...req
        })
      }
    },
    [countBarChart, countBarPieChart, countTable, page, statisticsDefultSet, statisticsReqUpdate]
  )

  useEffect(() => {
    fetchData()
  }, [])

  const currentStatistics = statisticsReq.find(item => item.page === page)

  if (!currentStatistics || countBarChartLoading || countBarPieChartLoading || countTableLoading) return <></>

  return (
    <VisitorTemplate
      statisticsReq={currentStatistics}
      refetch={fetchData}
      barChartData={barChartData}
      barPieChartData={barPieChartData}
      tableData={barTableData}
    />
  )
}

export default VisitorReportWeekDay
