import React, { FC, useContext, useEffect, useState } from 'react'
import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { CamerasContext } from 'src/context/CamerasContext'
import { useLayout } from 'src/hooks/useLayout'
import { ICameraClient } from 'src/model/cameras/CamerasModel'
import ClientListGrid from 'src/pages/user-setting/client/ClientListGrid'
import CameraUserSettingDetail from './CameraUserSettingDetail'

const CameraUserSetting: FC = (): React.ReactElement => {
  const [selectClient, setSelectClient] = useState<ICameraClient | null>(null)
  const { layoutDisplay } = useLayout()
  const { setCameraPage } = useContext(CamerasContext)

  useEffect(() => {
    setCameraPage('user-setting')

    return () => {
      setCameraPage(undefined)
    }
  }, [])

  const sideContent = <ClientListGrid />

  const mainContent = <CameraUserSettingDetail selectClient={selectClient} />

  return (
    <StandardTemplate title={'사용자별 카메라설정'}>
      <SlidingLayout
        isOpen={layoutDisplay}
        sideContent={sideContent}
        mainContent={mainContent}
        maxHeight='85vh'
        minHeight='85vh'
      />
    </StandardTemplate>
  )
}
export default CameraUserSetting
