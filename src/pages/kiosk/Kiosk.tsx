import { Box, Grid, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { useKiosk } from 'src/hooks/useKiosk'
import { useSocketData } from 'src/hooks/useSocketData'
import { MKiosk } from 'src/model/kiosk/kioskModel'
import { useKioskList } from 'src/service/kiosk/kioskService'
import KioskCard from './kioskList/KioskCard'
import KioskMenu from './kioskMenu/KioskMenu'
import KioskManageModal from './modal/KioskManageModal'
import KioskList from './table/KioskList'

const Kiosk: FC = (): React.ReactElement => {
  const kiosk = useKiosk()
  const socketData = useSocketData()
  const [dataFin, setDataFin] = useState<MKiosk[]>([])

  const { data, refetch } = useKioskList(kiosk.kioskListReq, response => {
    if (kiosk.initialKioskList.length === 0 && response.data) {
      kiosk.setInitialKioskList(response.data)
    }
  })

  const handleRefetch = async () => {
    const refetchResponse = await refetch()
    if (refetchResponse.data?.data) {
      kiosk.setInitialKioskList(refetchResponse.data.data)
    }
  }

  useEffect(() => {
    kiosk.setKioskListReq({})
    kiosk.setCheckedKioskIds([])
  }, [])

  useEffect(() => {
    if (dataFin.length > 0 && socketData.kioskHealth.length > 0) {
      // 새로운 데이터를 복사하여 업데이트하는 방식을 사용합니다.
      const updatedData = dataFin.map(kiosk => {
        // socketData.kioskHealth 배열에서 일치하는 항목을 찾습니다.
        const matchingHealth = socketData.kioskHealth.find(health => health.kioskId === kiosk.id)

        // 일치하는 항목이 있으면 kioskStatus를 업데이트하고, 그렇지 않으면 기존 kiosk 객체를 반환합니다.
        return matchingHealth ? { ...kiosk, kioskStatus: matchingHealth.status } : kiosk
      })

      // 업데이트된 데이터를 setDataFin으로 설정합니다.
      setDataFin(getSortedData(updatedData))
    }
  }, [socketData.kioskHealth])

  // 최초 데이터 조회시 상태 저장
  useEffect(() => {
    if (data?.data) {
      setDataFin(getSortedData(data?.data))
    }
  }, [data?.data])

  // 정렬 선택시 데이터 셋
  useEffect(() => {
    if (dataFin.length > 0) {
      setDataFin(getSortedData(dataFin))
    }
  }, [kiosk.kioskSort])

  // 데이터 정렬 함수
  const getSortedData = (data: MKiosk[]) => {
    if (!kiosk.kioskSort.field) return data

    const sortedData = [...data]
    const { field, sort } = kiosk.kioskSort

    sortedData.sort((a, b) => {
      const aValue = (a as any)[field]
      const bValue = (b as any)[field]

      // 문자열 비교일 때 로케일 설정
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort === 'asc' ? aValue.localeCompare(bValue, 'ko') : bValue.localeCompare(aValue, 'ko')
      }

      // 숫자 비교일 때 기존 비교 방식 사용
      if (aValue < bValue) return sort === 'asc' ? -1 : 1
      if (aValue > bValue) return sort === 'asc' ? 1 : -1

      return 0
    })

    return sortedData
  }

  if (!dataFin) {
    return <></>
  }

  return (
    <StandardTemplate title={'키오스크 관리'}>
      <KioskManageModal
        isOpen={kiosk.isKioskManagerModalOpen}
        onClose={() => {
          kiosk.setIsKioskManagerModalOpen(false)
          kiosk.setSelectedKioskInfo({})
        }}
        refetch={handleRefetch}
      />
      <Box pt={8}>
        <Grid container spacing={1} sx={{ mb: 10 }}>
          <Grid item sm={12} xs={12}>
            <KioskMenu refetch={handleRefetch} />
          </Grid>
          <Grid item sm={12} xs={12}>
            <Box>
              <Typography variant='h6' fontWeight={500} sx={{ mt: 5, mb: 3 }}>
                전체 키오스크는 총 {dataFin?.length}대입니다.
              </Typography>
              <DividerBar />
              <Typography variant='body2' sx={{ fontSize: 16, mt: 3, mb: 3 }}>
                전체 {dataFin?.length}대 키오스크 중 동작중인 키오스크는{' '}
                {dataFin?.filter(kiosk => kiosk.kioskStatus === KIOSK_STATUS.ENABLED).length}대, 동작중지{' '}
                {dataFin?.filter(kiosk => kiosk.kioskStatus === KIOSK_STATUS.DISABLED).length}대, 동작오류{' '}
                {dataFin?.filter(kiosk => kiosk.kioskStatus === KIOSK_STATUS.ERROR).length}대 입니다.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box gap={5} sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {kiosk.kioskViewType === 'card' ? (
            dataFin?.map((item, index) => <KioskCard key={index} kioskData={item} refetch={handleRefetch} />)
          ) : (
            <KioskList data={dataFin || []} refetch={handleRefetch} />
          )}
        </Box>
      </Box>
    </StandardTemplate>
  )
}

export default Kiosk
