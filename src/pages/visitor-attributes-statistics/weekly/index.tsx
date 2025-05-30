import { FC, useEffect } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorAttributesReport } from 'src/hooks/useVisitorAttributesReport'
import {
  useGenderAgeWeeklyBarChart,
  useGenderAgeWeeklyHeatmapChart,
  useGenderAgeWeeklyPyramidPieChart,
  useGenderAgeWeeklyTable
} from 'src/service/statistics/statisticsService'
import { getCurrentAndPreviousWeekDates } from 'src/utils/CommonUtil'

const VisitorAttributesStatisticsWeekly: FC = (): React.ReactElement => {
  const { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading } = useGenderAgeWeeklyBarChart()
  const { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading } =
    useGenderAgeWeeklyPyramidPieChart()
  const { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading } =
    useGenderAgeWeeklyHeatmapChart()
  const { mutateAsync: genderAgeTable, isLoading: genderAgeTableLoading } = useGenderAgeWeeklyTable()

  const page = EStatisticsPage.VISITOR_ATTRIBUTES_STATISTICS

  const { startDate, endDate } = getCurrentAndPreviousWeekDates()

  const { currentStatistics, barChartData, pyramidPieChartData, heatmapChartData, tableData, fetchData, isLoading } =
    useVisitorAttributesReport({
      page,
      tableType: ETableType.WEEKLY,
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

export default VisitorAttributesStatisticsWeekly
