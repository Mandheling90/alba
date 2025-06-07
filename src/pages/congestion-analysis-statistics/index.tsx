import { Box, Button, Grid } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { EPath } from 'src/enum/statisticsEnum'
import { useModal } from 'src/hooks/useModal'
import { useWebSocket } from 'src/hooks/useWebSocket'
import IconCustom from 'src/layouts/components/IconCustom'
import CongestionCard from './windowCard/CongestionCard'

const CongestionAnalysisStatistics: FC = (): React.ReactElement => {
  const [currentData, setCurrentData] = useState()

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

  const handleRefresh = () => {
    console.log('새로고침')
  }

  const handleDelete = () => {
    console.log('삭제')
  }

  const { setSimpleDialogModalProps } = useModal()

  return (
    <StandardTemplate
      title={'아난티 레스토랑 좌석 점유률 현황'}
      rightButtonList={
        <Box display={'flex'} gap={2}>
          <Button
            variant='contained'
            color='primary'
            startIcon={<IconCustom icon='plus-box' isCommon />}
            onClick={() => {
              setSimpleDialogModalProps({
                open: true,
                title: '시설 추가',
                contents: '시설 추가 내용'
              })
            }}
          >
            시설 추가
          </Button>
          <Button
            variant='contained'
            color='primary'
            startIcon={<IconCustom icon='bell-plus' isCommon />}
            onClick={() => {
              setSimpleDialogModalProps({
                open: true,
                isConfirm: true,
                title: '점유율 단계 설정',
                contents: <>123</>,
                confirmFn: () => {
                  console.log('confirmFn')
                },
                confirmText: '저장'
              })
            }}
          >
            상태 설정
          </Button>
        </Box>
      }
    >
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <CongestionCard
            title='시설 A'
            maxCapacity={10}
            currentOccupancy={110}
            occupancyRate={111}
            onRefresh={handleRefresh}
            onDelete={handleDelete}
          />
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default CongestionAnalysisStatistics
