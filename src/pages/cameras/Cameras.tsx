import React, { FC, useEffect, useState } from 'react'
import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { ICameraClient } from 'src/model/cameras/CamerasModel'
import ClientListGrid from '../user-setting/client/ClientListGrid'
import CamerasDetail from './CamerasDetail'

const Cameras: FC = (): React.ReactElement => {
  const [selectClient, setSelectClient] = useState<ICameraClient | null>(null)
  const { layoutDisplay, setCompanyId, setCompanyName, setCompanyNo } = useLayout()
  const { user } = useAuth()
  useEffect(() => {
    if (user?.userInfo?.companyNo && user?.userInfo?.companyId && user?.userInfo?.companyName) {
      setCompanyNo(user?.userInfo?.companyNo)
      setCompanyId(user?.userInfo?.companyId)
      setCompanyName(user?.userInfo?.companyName)
    }
  }, [])

  const handleSelectClientGrid = (row: any) => {
    setCompanyNo(row.companyNo)
    setCompanyId(row.companyId)
    setCompanyName(row.companyName)
  }

  const sideContent = <ClientListGrid selectRowEvent={handleSelectClientGrid} />

  const mainContent = <CamerasDetail selectClient={selectClient} />

  return (
    <StandardTemplate title={'카메라 관리'}>
      <SlidingLayout isOpen={layoutDisplay} sideContent={sideContent} mainContent={mainContent} maxHeight='85vh' />
    </StandardTemplate>
  )
}
export default Cameras
