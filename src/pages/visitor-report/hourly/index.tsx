import { format } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import VisitorTemplate from 'src/@core/components/charts/template/VisitorTemplate'
import { ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { ICountBarChart, ICountBarPieChart, ITableData } from 'src/model/statistics/StatisticsModel'
import {
  useCountHourlyBarChart,
  useCountHourlyBarPieChart,
  useCountHourlyBarTable
} from 'src/service/statistics/statisticsService'

const VisitorReportHourly: FC = (): React.ReactElement => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const { mutateAsync: countBarChart, isLoading: countBarChartLoading } = useCountHourlyBarChart()
  const { mutateAsync: countBarPieChart, isLoading: countBarPieChartLoading } = useCountHourlyBarPieChart()
  const { mutateAsync: countBarTable, isLoading: countBarTableLoading } = useCountHourlyBarTable()

  const page = EStatisticsPage.HOURLY
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [barPieChartData, setBarPieChartData] = useState<ICountBarPieChart>()
  const [tableData, setTableData] = useState<ITableData>()

  const fetchData = useCallback(
    async (req?: IStatisticsContextReq) => {
      const today = new Date()
      const formattedToday = format(today, 'yyyy-MM-dd')

      const statistics =
        req ||
        (await statisticsDefultSet({
          startDate: formattedToday,
          endDate: formattedToday,
          tableType: ETableType.HOURLY,
          page: page
        }))

      const res = await countBarChart(statistics)
      setBarChartData(res.data)

      const resPie = await countBarPieChart(statistics)
      setBarPieChartData(resPie.data)

      const resTable = await countBarTable(statistics)
      setTableData(resTable.data)

      if (req) {
        statisticsReqUpdate({
          ...req
        })
      }
    },
    [countBarChart, countBarPieChart, countBarTable, page, statisticsDefultSet, statisticsReqUpdate]
  )

  useEffect(() => {
    fetchData()
  }, [])

  const currentStatistics = statisticsReq.find(item => item.page === page)

  if (!currentStatistics || countBarChartLoading || countBarPieChartLoading || countBarTableLoading) return <></>

  return (
    <VisitorTemplate
      statisticsReq={currentStatistics}
      refetch={fetchData}
      barChartData={barChartData}
      barPieChartData={barPieChartData}
      tableData={tableData}
    />
  )
}

export default VisitorReportHourly
