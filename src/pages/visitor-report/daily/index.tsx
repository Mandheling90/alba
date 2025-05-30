import { FC, useEffect } from 'react'
import VisitorTemplate from 'src/@core/components/charts/template/VisitorTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorReport } from 'src/hooks/useVisitorReport'
import {
  useCountDailyBarChart,
  useCountDailyBarPieChart,
  useCountDailyTable
} from 'src/service/statistics/statisticsService'

const VisitorReportDaily: FC = (): React.ReactElement => {
  const { mutateAsync: countBarChart, isLoading: countBarChartLoading } = useCountDailyBarChart()
  const { mutateAsync: countBarPieChart, isLoading: countBarPieChartLoading } = useCountDailyBarPieChart()
  const { mutateAsync: countTable, isLoading: countTableLoading } = useCountDailyTable()

  const page = EStatisticsPage.VISITOR_REPORT

  const { currentStatistics, barChartData, barPieChartData, barTableData, fetchData, isLoading } = useVisitorReport({
    page,
    tableType: ETableType.DAILY,
    daysToSubtract: 1,
    countBarChart: { mutateAsync: countBarChart, isLoading: countBarChartLoading },
    countBarPieChart: { mutateAsync: countBarPieChart, isLoading: countBarPieChartLoading },
    countTable: { mutateAsync: countTable, isLoading: countTableLoading }
  })

  useEffect(() => {
    fetchData()
  }, [])

  if (!currentStatistics || isLoading) return <></>

  return (
    <VisitorTemplate
      statisticsReq={currentStatistics}
      refetch={req => {
        fetchData(req)
      }}
      barChartData={barChartData}
      barPieChartData={barPieChartData}
      tableData={barTableData}
    />
  )
}

export default VisitorReportDaily
