import React, { FC, useState } from 'react'
import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useCameras } from 'src/hooks/useCameras'
import { useLayout } from 'src/hooks/useLayout'
import { ICameraClient } from 'src/model/cameras/CamerasModel'
import ClientListGrid from '../user-setting/client/ClientListGrid'
import CamerasDetail from './CamerasDetail'

const Cameras: FC = (): React.ReactElement => {
  const cameraContext = useCameras()
  const layoutContext = useLayout()
  const [selectClient, setSelectClient] = useState<ICameraClient | null>(null)

  const handleSelectClientGrid = (row: ICameraClient) => {
    console.log(row)
    setSelectClient(row)
  }

  const sideContent = <ClientListGrid selectRowEvent={handleSelectClientGrid} />

  const mainContent = <CamerasDetail selectClient={selectClient} />

  return (
    <StandardTemplate title={'카메라 관리'}>
      <SlidingLayout
        isOpen={layoutContext.layoutDisplay}
        sideContent={sideContent}
        mainContent={mainContent}
        maxHeight='85vh'
      />
    </StandardTemplate>
  )
}
export default Cameras
