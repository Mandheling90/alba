import { FC, useEffect } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorAttributesReport } from 'src/hooks/useVisitorAttributesReport'
import {
  useGenderAgeDailyBarChart,
  useGenderAgeDailyHeatmapChart,
  useGenderAgeDailyPyramidPieChart,
  useGenderAgeDailyTable
} from 'src/service/statistics/statisticsService'

const VisitorAttributesStatisticsDaily: FC = (): React.ReactElement => {
  const { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading } = useGenderAgeDailyBarChart()
  const { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading } =
    useGenderAgeDailyPyramidPieChart()
  const { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading } =
    useGenderAgeDailyHeatmapChart()
  const { mutateAsync: genderAgeTable, isLoading: genderAgeTableLoading } = useGenderAgeDailyTable()

  const page = EStatisticsPage.VISITOR_ATTRIBUTES_STATISTICS

  const { currentStatistics, barChartData, pyramidPieChartData, heatmapChartData, tableData, fetchData, isLoading } =
    useVisitorAttributesReport({
      page,
      tableType: ETableType.DAILY,
      daysToSubtract: 1,
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

export default VisitorAttributesStatisticsDaily
