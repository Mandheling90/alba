import { format, subDays } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { ICountBarChart, IHeatMapChart, IPyramidPieChart } from 'src/model/statistics/StatisticsModel'
import {
  useGenderAgeWeeklyBarChart,
  useGenderAgeWeeklyHeatmapChart,
  useGenderAgeWeeklyPyramidPieChart
} from 'src/service/statistics/statisticsService'

const VisitorAttributesStatisticsWeekly: FC = ({}): React.ReactElement => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading } = useGenderAgeWeeklyBarChart()
  const { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading } =
    useGenderAgeWeeklyPyramidPieChart()
  const { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading } =
    useGenderAgeWeeklyHeatmapChart()

  const page = EStatisticsPage.WEEKLY_ATTRIBUTES
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [pyramidPieChartData, setPyramidPieChartData] = useState<IPyramidPieChart>()
  const [heatmapChartData, setHeatmapChartData] = useState<IHeatMapChart>()

  const fetchData = useCallback(
    async (req?: IStatisticsContextReq) => {
      const today = new Date()
      const threeDaysAgo = subDays(today, 29)
      const formattedToday = format(today, 'yyyy-MM-dd')
      const formattedThreeDaysAgo = format(threeDaysAgo, 'yyyy-MM-dd')

      const statistics =
        req ||
        (await statisticsDefultSet({
          startDate: formattedThreeDaysAgo,
          endDate: formattedToday,
          tableType: ETableType.WEEKLY,
          page: page
        }))

      const res = await genderAgeBarChart(statistics)
      setBarChartData(res.data)

      const resPie = await genderAgePyramidPieChart(statistics)
      setPyramidPieChartData(resPie.data)

      const resTable = await genderAgeHeatmapChart(statistics)
      setHeatmapChartData(resTable.data)

      if (req) {
        statisticsReqUpdate({
          ...req
        })
      }
    },
    [genderAgeBarChart, genderAgePyramidPieChart, genderAgeHeatmapChart, page, statisticsDefultSet, statisticsReqUpdate]
  )

  useEffect(() => {
    fetchData()
  }, [])

  const currentStatistics = statisticsReq.find(item => item.page === page)

  if (
    !currentStatistics ||
    genderAgeBarChartLoading ||
    genderAgePyramidPieChartLoading ||
    genderAgeHeatmapChartLoading
  ) {
    return <></>
  }

  return (
    <VisitorAttributesTemplate
      statisticsReq={currentStatistics}
      barChartData={barChartData}
      pyramidPieChartData={pyramidPieChartData}
      heatmapChartData={heatmapChartData}
      refetch={fetchData}
    />
  )
}

export default VisitorAttributesStatisticsWeekly
