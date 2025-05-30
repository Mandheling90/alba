import { FC, useEffect } from 'react'
import VisitorTemplate from 'src/@core/components/charts/template/VisitorTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorReport } from 'src/hooks/useVisitorReport'
import {
  useCountWeeklyBarChart,
  useCountWeeklyBarPieChart,
  useCountWeeklyTable
} from 'src/service/statistics/statisticsService'
import { getCurrentAndPreviousWeekDates } from 'src/utils/CommonUtil'

const VisitorReportWeekly: FC = (): React.ReactElement => {
  const { mutateAsync: countBarChart, isLoading: countBarChartLoading } = useCountWeeklyBarChart()
  const { mutateAsync: countBarPieChart, isLoading: countBarPieChartLoading } = useCountWeeklyBarPieChart()
  const { mutateAsync: countTable, isLoading: countTableLoading } = useCountWeeklyTable()

  const page = EStatisticsPage.VISITOR_REPORT

  const { startDate, endDate } = getCurrentAndPreviousWeekDates()

  const { currentStatistics, barChartData, barPieChartData, barTableData, fetchData, isLoading } = useVisitorReport({
    page,
    tableType: ETableType.WEEKLY,
    startDate,
    endDate,
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

export default VisitorReportWeekly
