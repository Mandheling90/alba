import { FC, useEffect } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorAttributesReport } from 'src/hooks/useVisitorAttributesReport'
import {
  useGenderAgeMonthlyBarChart,
  useGenderAgeMonthlyHeatmapChart,
  useGenderAgeMonthlyPyramidPieChart,
  useGenderAgeMonthlyTable
} from 'src/service/statistics/statisticsService'
import { getCurrentAndPreviousMonthDates } from 'src/utils/CommonUtil'

const VisitorAttributesStatisticsMonthly: FC = (): React.ReactElement => {
  const { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading } = useGenderAgeMonthlyBarChart()
  const { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading } =
    useGenderAgeMonthlyPyramidPieChart()
  const { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading } =
    useGenderAgeMonthlyHeatmapChart()
  const { mutateAsync: genderAgeTable, isLoading: genderAgeTableLoading } = useGenderAgeMonthlyTable()

  const page = EStatisticsPage.VISITOR_ATTRIBUTES_STATISTICS

  const { startDate, endDate } = getCurrentAndPreviousMonthDates()

  const { currentStatistics, barChartData, pyramidPieChartData, heatmapChartData, tableData, fetchData, isLoading } =
    useVisitorAttributesReport({
      page,
      tableType: ETableType.MONTHLY,
      startDate,
      endDate,
      countBarChart: { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading },
      countPyramidPieChart: { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading },
      countHeatmapChart: { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading },
      countTable: { mutateAsync: genderAgeTable, isLoading: genderAgeTableLoading }
    })

  useEffect(() => {
    fetchData()
  }, [])

  if (!currentStatistics || isLoading) return <></>

  return (
    <VisitorAttributesTemplate
      statisticsReq={currentStatistics}
      barChartData={barChartData}
      pyramidPieChartData={pyramidPieChartData}
      heatmapChartData={heatmapChartData}
      tableData={tableData}
      refetch={req => {
        fetchData(req)
      }}
    />
  )
}

export default VisitorAttributesStatisticsMonthly
