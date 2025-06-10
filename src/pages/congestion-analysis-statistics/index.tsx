import { Grid } from '@mui/material'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { EPath } from 'src/enum/statisticsEnum'
import { useWebSocket } from 'src/hooks/useWebSocket'
import { IAreaStatsDto } from 'src/model/statistics/StatisticsModel'
import HeaderButtons from './components/HeaderButtons'
import CongestionCard from './windowCard/CongestionCard'

const CongestionAnalysisStatistics: FC = (): React.ReactElement => {
  const [currentData, setCurrentData] = useState<IAreaStatsDto>()

  const logErrorToServer = async (errorMessage: string) => {
    try {
      console.log(errorMessage)
    } catch (error) {
      console.error('에러 로그 전송 중 오류 발생:', error)
    }
  }

  const timeOut = () => {
    console.log('WebSocket 연결 시간 초과')
  }

  const { responseMessages } = useWebSocket(EPath.STATS_ZONE_STATUS, logErrorToServer, timeOut)

  useEffect(() => {
    if (responseMessages[0]) {
      try {
        const data = JSON.parse(responseMessages[0])
        setCurrentData(data)
      } catch (error) {
        console.error('WebSocket 데이터 파싱 오류:', error)
      }
    }
  }, [responseMessages])

  const handleRefresh = async (areaId: number) => {
    try {
      const response = await axios.delete(`http://210.216.236.181:12708/area/${areaId}/data`)
      if (response.status === 200) {
        console.log('삭제 성공')

        // 삭제 후 데이터 새로고침 로직 추가 가능
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error)
    }
  }

  const handleDelete = async (areaId: number) => {
    // try {
    //   const response = await axios.delete(`http://210.216.236.181/area/${areaId}/data`)
    //   if (response.status === 200) {
    //     console.log('삭제 성공')
    //     // 삭제 후 데이터 새로고침 로직 추가 가능
    //   }
    // } catch (error) {
    //   console.error('삭제 중 오류 발생:', error)
    // }
  }

  console.log(currentData)

  return (
    <StandardTemplate title={'아난티 레스토랑 좌석 점유률 현황'} rightButtonList={<HeaderButtons />}>
      <Grid container gap={5} sx={{ mb: 5 }}>
        {currentData?.areaStatsDtoList.map((item, i: number) => (
          <CongestionCard
            key={item.areaId + i}
            data={item}
            onRefresh={handleRefresh}
            onDelete={() => handleDelete(item.areaId)}
          />
        ))}
      </Grid>
    </StandardTemplate>
  )
}

export default CongestionAnalysisStatistics
