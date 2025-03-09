import React, { FC, useState } from 'react'
import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useCameras } from 'src/hooks/useCameras'
import { ICameraClient } from 'src/model/cameras/CamerasModel'
import CamerasClient from './CamerasClient'
import CamerasDetail from './CamerasDetail'

const Cameras: FC = (): React.ReactElement => {
  const cameraContext = useCameras()
  const [selectClient, setSelectClient] = useState<ICameraClient | null>(null)

  const handleSelectClientGrid = (row: ICameraClient) => {
    console.log(row)
    setSelectClient(row)
  }

  return (
    <StandardTemplate title={'카메라 관리'}>
      <SlidingLayout
        isOpen={cameraContext.layoutDisplay}
        sideContent={<CamerasClient handleSelectClientGrid={handleSelectClientGrid} />}
        mainContent={<CamerasDetail selectClient={selectClient} />}
        maxHeight='85vh'
      />
    </StandardTemplate>
  )
}
export default Cameras
