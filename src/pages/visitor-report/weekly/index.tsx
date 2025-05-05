import { format, subDays } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import VisitorTemplate from 'src/@core/components/charts/template/VisitorTemplate'
import { IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { ICountBarChart, ICountBarPieChart, ICountBarTable } from 'src/model/statistics/StatisticsModel'
import {
  useCountWeeklyBarChart,
  useCountWeeklyBarPieChart,
  useCountWeeklyTable
} from 'src/service/statistics/statisticsService'

const VisitorReportWeekly: FC = (): React.ReactElement => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const { mutateAsync: countBarChart, isLoading: countBarChartLoading } = useCountWeeklyBarChart()
  const { mutateAsync: countBarPieChart, isLoading: countBarPieChartLoading } = useCountWeeklyBarPieChart()
  const { mutateAsync: countTable, isLoading: countTableLoading } = useCountWeeklyTable()

  const page = EStatisticsPage.WEEKLY
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [barPieChartData, setBarPieChartData] = useState<ICountBarPieChart>()
  const [barTableData, setBarTableData] = useState<ICountBarTable>()

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
          tableType: 'weekly',
          page: page
        }))

      const res = await countBarChart(statistics)
      setBarChartData(res.data)

      const resPie = await countBarPieChart(statistics)
      setBarPieChartData(resPie.data)

      const resTable = await countTable(statistics)
      setBarTableData(resTable.data)

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
      barTableData={barTableData}
    />
  )
}

export default VisitorReportWeekly
