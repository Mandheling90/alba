import { FC, useEffect } from 'react'
import VisitorTemplate from 'src/@core/components/charts/template/VisitorTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorReport } from 'src/hooks/useVisitorReport'
import {
  useCountWeekDayBarChart,
  useCountWeekDayBarPieChart,
  useCountWeekDayTable
} from 'src/service/statistics/statisticsService'
import { getCurrentWeekDates } from 'src/utils/CommonUtil'

const VisitorReportWeekDay: FC = (): React.ReactElement => {
  const { mutateAsync: countBarChart, isLoading: countBarChartLoading } = useCountWeekDayBarChart()
  const { mutateAsync: countBarPieChart, isLoading: countBarPieChartLoading } = useCountWeekDayBarPieChart()
  const { mutateAsync: countTable, isLoading: countTableLoading } = useCountWeekDayTable()

  const page = EStatisticsPage.VISITOR_REPORT

  const { startDate, endDate } = getCurrentWeekDates()

  const { currentStatistics, barChartData, barPieChartData, barTableData, fetchData, isLoading } = useVisitorReport({
    page,
    tableType: ETableType.WEEKDAY,
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

export default VisitorReportWeekDay
