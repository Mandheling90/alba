import { Box, Grid, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { useKiosk } from 'src/hooks/useKiosk'
import { useMonitoring } from 'src/hooks/useMonitoring'
import { useSocketData } from 'src/hooks/useSocketData'
import { MMonitoringHealth } from 'src/model/monitoring/monitoringModel'
import MonitoringCard from './kioskList/MonitoringCard'
import MonitoringMenu from './monitoringMenu/KioskMenu'

const Monitoring: FC = (): React.ReactElement => {
  const kiosk = useKiosk()
  const monitoring = useMonitoring()
  const socketData = useSocketData()

  const [data, setData] = useState<MMonitoringHealth[]>([])

  useEffect(() => {
    kiosk.setKioskListReq({})
    kiosk.setCheckedKioskIds([])
    monitoring.setMonitoringFilter({ keyWord: '', sort: 'asc', status: KIOSK_STATUS.ALL })
  }, [])

  const getSortedData = () => {
    const { keyWord, sort, status } = monitoring.monitoringFilter

    // 키워드와 상태에 맞게 필터링
    const filteredData = socketData.monitoringHealth.filter(kiosk => {
      const matchesKeyWord = keyWord ? kiosk.kioskName.includes(keyWord) : true
      const matchesStatus = status === KIOSK_STATUS.ALL ? true : kiosk.status === status

      return matchesKeyWord && matchesStatus
    })

    const sortedData = filteredData.sort((a, b) => {
      const aValue = a.kioskName
      const bValue = b.kioskName

      if (aValue < bValue) return sort === 'asc' ? -1 : 1
      if (aValue > bValue) return sort === 'asc' ? 1 : -1

      return 0
    })

    // 정렬 후 상태 업데이트
    setData(sortedData)
  }

  useEffect(() => {
    getSortedData()
  }, [socketData.monitoringHealth, monitoring.monitoringFilter])

  // console.log(data)

  if (!data) {
    return <></>
  }

  return (
    <StandardTemplate title={'시스템 모니터링 및 전원관리'}>
      <Box pt={8}>
        <Grid container spacing={1} sx={{ mb: 10 }}>
          <Grid item sm={12} xs={12}>
            <MonitoringMenu />
          </Grid>
          <Grid item sm={12} xs={12}>
            <Box>
              <Typography variant='h6' fontWeight={500} sx={{ mt: 5, mb: 3 }}>
                전체 키오스크는 총 {data?.length}대입니다.
              </Typography>
              <DividerBar />
              <Typography variant='body2' sx={{ fontSize: 16, mt: 3, mb: 3 }}>
                전체 {data?.length}대 키오스크 중 동작중인 키오스크는{' '}
                {data?.filter(kiosk => kiosk.status === KIOSK_STATUS.ENABLED).length}대, 동작중지{' '}
                {data?.filter(kiosk => kiosk.status === KIOSK_STATUS.DISABLED).length}
                대, 동작오류 {data?.filter(kiosk => kiosk.status === KIOSK_STATUS.ERROR).length}대 입니다.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box gap={5} sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {data?.map((item, index) => (
            <MonitoringCard key={index} kioskData={item} refetch={() => null} />
          ))}
        </Box>
      </Box>
    </StandardTemplate>
  )
}

export default Monitoring
