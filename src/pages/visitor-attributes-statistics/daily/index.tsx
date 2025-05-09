import { format, subDays } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import {
  IAgeGenderStatisticsTableResponse,
  ICountBarChart,
  IHeatMapChart,
  IPyramidPieChart
} from 'src/model/statistics/StatisticsModel'
import {
  useGenderAgeDailyBarChart,
  useGenderAgeDailyHeatmapChart,
  useGenderAgeDailyPyramidPieChart,
  useGenderAgeDailyTable
} from 'src/service/statistics/statisticsService'

const VisitorAttributesStatisticsDaily: FC = ({}): React.ReactElement => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const { mutateAsync: genderAgeBarChart, isLoading: genderAgeBarChartLoading } = useGenderAgeDailyBarChart()
  const { mutateAsync: genderAgePyramidPieChart, isLoading: genderAgePyramidPieChartLoading } =
    useGenderAgeDailyPyramidPieChart()
  const { mutateAsync: genderAgeHeatmapChart, isLoading: genderAgeHeatmapChartLoading } =
    useGenderAgeDailyHeatmapChart()
  const { mutateAsync: genderAgeTable, isLoading: genderAgeTableLoading } = useGenderAgeDailyTable()

  const page = EStatisticsPage.DAILY_ATTRIBUTES
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [pyramidPieChartData, setPyramidPieChartData] = useState<IPyramidPieChart>()
  const [heatmapChartData, setHeatmapChartData] = useState<IHeatMapChart>()
  const [tableData, setTableData] = useState<IAgeGenderStatisticsTableResponse>()

  const fetchData = useCallback(
    async (req?: IStatisticsContextReq) => {
      const today = new Date()
      const threeDaysAgo = subDays(today, 6)
      const formattedToday = format(today, 'yyyy-MM-dd')
      const formattedThreeDaysAgo = format(threeDaysAgo, 'yyyy-MM-dd')

      const statistics =
        req ||
        (await statisticsDefultSet({
          startDate: formattedThreeDaysAgo,
          endDate: formattedToday,
          tableType: ETableType.DAILY,
          page: page
        }))

      const res = await genderAgeBarChart(statistics)
      setBarChartData(res.data)

      const resPie = await genderAgePyramidPieChart(statistics)
      setPyramidPieChartData(resPie.data)

      const resTable = await genderAgeHeatmapChart(statistics)
      setHeatmapChartData(resTable.data)

      const resTableData = await genderAgeTable(statistics)
      const tableDataWithKeys = {
        ...resTableData.data,
        dataList: resTableData.data.dataList.map((item, index) => ({
          ...item,
          key: `table-item-${index}}`,
          dataList: item.dataList?.map((subItem, subIndex) => ({
            ...subItem,
            key: `table-sub-item-${index}-${subIndex}}`
          }))
        }))
      }
      setTableData(tableDataWithKeys)

      if (req) {
        statisticsReqUpdate({
          ...req
        })
      }
    },
    [
      statisticsDefultSet,
      page,
      genderAgeBarChart,
      genderAgePyramidPieChart,
      genderAgeHeatmapChart,
      genderAgeTable,
      statisticsReqUpdate
    ]
  )

  useEffect(() => {
    fetchData()
  }, [])

  const currentStatistics = statisticsReq.find(item => item.page === page)

  if (
    !currentStatistics ||
    genderAgeBarChartLoading ||
    genderAgePyramidPieChartLoading ||
    genderAgeHeatmapChartLoading ||
    genderAgeTableLoading
  )
    return <></>

  return (
    <VisitorAttributesTemplate
      statisticsReq={currentStatistics}
      barChartData={barChartData}
      pyramidPieChartData={pyramidPieChartData}
      heatmapChartData={heatmapChartData}
      tableData={tableData}
      refetch={fetchData}
    />
  )
}

export default VisitorAttributesStatisticsDaily
