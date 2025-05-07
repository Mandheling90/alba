import { format } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { ICountBarChart, IHeatMapChart, IPyramidPieChart } from 'src/model/statistics/StatisticsModel'
import {
  useGenderAgeHourlyBarChart,
  useGenderAgeHourlyHeatmapChart,
  useGenderAgeHourlyPyramidPieChart
} from 'src/service/statistics/statisticsService'

const VisitorAttributesStatisticsHourly: FC = ({}): React.ReactElement => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading } = useGenderAgeHourlyBarChart()
  const { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading } =
    useGenderAgeHourlyPyramidPieChart()
  const { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading } =
    useGenderAgeHourlyHeatmapChart()

  const page = EStatisticsPage.HOURLY_ATTRIBUTES
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [pyramidPieChartData, setPyramidPieChartData] = useState<IPyramidPieChart>()
  const [heatmapChartData, setHeatmapChartData] = useState<IHeatMapChart>()

  const fetchData = useCallback(
    async (req?: IStatisticsContextReq) => {
      const today = new Date()
      const formattedToday = format(today, 'yyyy-MM-dd')

      const statistics =
        req ||
        (await statisticsDefultSet({
          startDate: formattedToday,
          endDate: formattedToday,
          tableType: ETableType.HOURLY,
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

export default VisitorAttributesStatisticsHourly
