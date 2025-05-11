import React, { FC, useState } from 'react'
import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import { useLayout } from 'src/hooks/useLayout'
import { ICameraClient } from 'src/model/cameras/CamerasModel'

import ClientListGrid from 'src/pages/user-setting/client/ClientListGrid'
import StatTerm from './StatTerm'

const StatTermManager: FC = (): React.ReactElement => {
  const [selectClient, setSelectClient] = useState<ICameraClient | null>(null)
  const { layoutDisplay } = useLayout()

  const sideContent = <ClientListGrid />

  const mainContent = <StatTerm selectClient={selectClient} />

  return (
    <StandardTemplate title={'통계 용어 관리'}>
      <SlidingLayout isOpen={layoutDisplay} sideContent={sideContent} mainContent={mainContent} maxHeight='85vh' />
    </StandardTemplate>
  )
}
export default StatTermManager
