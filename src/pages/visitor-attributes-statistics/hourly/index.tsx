import { format } from 'date-fns'
import { FC, useCallback, useEffect, useState } from 'react'
import VisitorAttributesTemplate from 'src/@core/components/charts/template/VisitorAttributesTemplate'
import { IStatisticsContextReq } from 'src/context/StatisticsContext'
import { useStatistics } from 'src/hooks/useStatistics'
import { ICountBarChart } from 'src/model/statistics/StatisticsModel'
import { useGenderAgeHourlyBarChart } from 'src/service/statistics/statisticsService'

const VisitorAttributesStatisticsHourly: FC = ({}): React.ReactElement => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const { mutateAsync: genderAgeHourlyBarChart } = useGenderAgeHourlyBarChart()
  const page = 'visitor-attributes-statistics-hourly'

  const fetchData = useCallback(
    async (req?: IStatisticsContextReq) => {
      const today = new Date()
      const formattedToday = format(today, 'yyyy-MM-dd')

      const statistics =
        req ||
        (await statisticsDefultSet({
          startDate: formattedToday,
          endDate: formattedToday,
          page: page
        }))

      const res = await genderAgeHourlyBarChart(statistics)
      setBarChartData(res.data)

      if (req) {
        statisticsReqUpdate({
          ...req
        })
      }
    },
    [statisticsDefultSet, genderAgeHourlyBarChart, statisticsReqUpdate]
  )

  useEffect(() => {
    fetchData()
  }, [])

  const currentStatistics = statisticsReq.find(item => item.page === page)

  if (!currentStatistics) return <></>

  return <VisitorAttributesTemplate statisticsReq={currentStatistics} barChartData={barChartData} refetch={fetchData} />
}

export default VisitorAttributesStatisticsHourly
