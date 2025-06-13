import { format, subDays } from 'date-fns'
import { useCallback, useState } from 'react'
import { ETableType, IStatisticsContextReq } from 'src/context/StatisticsContext'
import { EStatisticsPage } from 'src/enum/statisticsEnum'
import { useStatistics } from 'src/hooks/useStatistics'
import { ICountBarChart, ICountBarPieChart, ITableData } from 'src/model/statistics/StatisticsModel'
import { useSearchCameraListMutation } from 'src/service/statistics/statisticsService'

interface UseVisitorReportProps {
  page: EStatisticsPage
  tableType: ETableType
  daysToSubtract?: number
  useSameDay?: boolean
  startDate?: string
  endDate?: string
  countBarChart: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: ICountBarChart }>
    isLoading: boolean
  }
  countBarPieChart: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: ICountBarPieChart }>
    isLoading: boolean
  }
  countTable: {
    mutateAsync: (req: IStatisticsContextReq) => Promise<{ data: ITableData }>
    isLoading: boolean
  }
}

export const useVisitorReport = ({
  page,
  tableType,
  daysToSubtract,
  useSameDay = false,
  startDate,
  endDate,
  countBarChart,
  countBarPieChart,
  countTable
}: UseVisitorReportProps) => {
  const { statisticsReq, statisticsDefultSet, statisticsReqUpdate } = useStatistics()
  const [barChartData, setBarChartData] = useState<ICountBarChart>()
  const [barPieChartData, setBarPieChartData] = useState<ICountBarPieChart>()
  const [barTableData, setBarTableData] = useState<ITableData>()
  const [currentStatistics, setCurrentStatistics] = useState<IStatisticsContextReq>()

  const { mutateAsync: searchCameraList } = useSearchCameraListMutation()

  const fetchData = useCallback(
    async (req?: IStatisticsContextReq) => {
      const today = new Date()
      const formattedToday = format(today, 'yyyy-MM-dd')

      // startDate와 endDate가 제공된 경우 해당 값을 사용하고,
      // 그렇지 않은 경우 daysToSubtract와 useSameDay를 사용하여 날짜 계산
      const formattedStartDate =
        startDate || (useSameDay ? formattedToday : format(subDays(today, daysToSubtract || 0), 'yyyy-MM-dd'))
      const formattedEndDate = endDate || formattedToday

      let statistics: IStatisticsContextReq

      if (req) {
        statistics = req

        // 기존 통계 요청에서 현재 페이지의 요청 찾기
        const existingPage = statisticsReq.find(item => item.page === page)

        // companyNo가 변경되었는지 확인
        const isCompanyNoChanged = existingPage?.companyNo !== req.companyNo

        if (isCompanyNoChanged) {
          // companyNo가 변경된 경우 새로운 통계 요청 생성
          const cameraListRes = await searchCameraList({ companyNo: req.companyNo ?? 0 })

          statistics = {
            ...req,
            cameraNos: cameraListRes.data.cameraList.map(camera => camera.cameraNo)
          }
        }

        statisticsReqUpdate({
          ...req,
          page: page
        })
      } else {
        statistics =
          statisticsReq.find(item => item.page === page) ??
          (await statisticsDefultSet({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            tableType: tableType,
            page: page
          }))
      }

      statistics = {
        ...statistics,
        tableType: tableType
      }

      const res = await countBarChart.mutateAsync(statistics)
      setBarChartData(res.data)

      const resPie = await countBarPieChart.mutateAsync(statistics)
      setBarPieChartData(resPie.data)

      const resTableData = await countTable.mutateAsync(statistics)
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
      setBarTableData(tableDataWithKeys)
      setCurrentStatistics(statistics)
    },
    [
      countBarChart.mutateAsync,
      countBarPieChart.mutateAsync,
      countTable.mutateAsync,
      page,
      statisticsDefultSet,
      statisticsReqUpdate,
      tableType,
      daysToSubtract,
      useSameDay,
      startDate,
      endDate
    ]
  )

  return {
    currentStatistics,
    barChartData,
    barPieChartData,
    barTableData,
    fetchData,
    isLoading: countBarChart.isLoading || countBarPieChart.isLoading || countTable.isLoading
  }
}
