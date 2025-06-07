import { FC, useEffect } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { ETableType } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useVisitorAttributesReport } from 'src/hooks/useVisitorAttributesReport'
import {
  useGenderAgeWeekDayBarChart,
  useGenderAgeWeekDayHeatmapChart,
  useGenderAgeWeekDayPyramidPieChart,
  useGenderAgeWeekDayTable
} from 'src/service/statistics/statisticsService'
import { getCurrentWeekDates } from 'src/utils/CommonUtil'

const VisitorAttributesStatisticsWeekDay: FC = (): React.ReactElement => {
  const { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading } = useGenderAgeWeekDayBarChart()
  const { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading } =
    useGenderAgeWeekDayPyramidPieChart()
  const { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading } =
    useGenderAgeWeekDayHeatmapChart()
  const { mutateAsync: genderAgeTable, isLoading: genderAgeTableLoading } = useGenderAgeWeekDayTable()

  const page = EStatisticsPage.WEEK_DAY_ATTRIBUTES

  const { startDate, endDate } = getCurrentWeekDates()

  const { currentStatistics, barChartData, pyramidPieChartData, heatmapChartData, tableData, fetchData, isLoading } =
    useVisitorAttributesReport({
      page,
      tableType: ETableType.WEEKDAY,
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

export default VisitorAttributesStatisticsWeekDay
