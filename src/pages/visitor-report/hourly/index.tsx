import { FC, useEffect } from 'react'
import VisitorTemplate from 'src/@core/components/charts/template/VisitorTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorReport } from 'src/hooks/useVisitorReport'
import {
  useCountHourlyBarChart,
  useCountHourlyBarPieChart,
  useCountHourlyBarTable
} from 'src/service/statistics/statisticsService'

const VisitorReportHourly: FC = (): React.ReactElement => {
  const { mutateAsync: countBarChart, isLoading: countBarChartLoading } = useCountHourlyBarChart()
  const { mutateAsync: countBarPieChart, isLoading: countBarPieChartLoading } = useCountHourlyBarPieChart()
  const { mutateAsync: countTable, isLoading: countTableLoading } = useCountHourlyBarTable()

  const page = EStatisticsPage.HOURLY

  const { currentStatistics, barChartData, barPieChartData, barTableData, fetchData, isLoading } = useVisitorReport({
    page,
    tableType: ETableType.HOURLY,
    useSameDay: true,
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

export default VisitorReportHourly
