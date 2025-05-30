import { FC, useEffect } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorAttributesReport } from 'src/hooks/useVisitorAttributesReport'
import {
  useGenderAgeHourlyBarChart,
  useGenderAgeHourlyHeatmapChart,
  useGenderAgeHourlyPyramidPieChart,
  useGenderAgeHourlyTable
} from 'src/service/statistics/statisticsService'

const VisitorAttributesStatisticsHourly: FC = (): React.ReactElement => {
  const { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading } = useGenderAgeHourlyBarChart()
  const { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading } =
    useGenderAgeHourlyPyramidPieChart()
  const { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading } =
    useGenderAgeHourlyHeatmapChart()
  const { mutateAsync: genderAgeTable, isLoading: genderAgeTableLoading } = useGenderAgeHourlyTable()

  const page = EStatisticsPage.HOURLY_ATTRIBUTES

  const { currentStatistics, barChartData, pyramidPieChartData, heatmapChartData, tableData, fetchData, isLoading } =
    useVisitorAttributesReport({
      page,
      tableType: ETableType.HOURLY,
      useSameDay: true,
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

export default VisitorAttributesStatisticsHourly
