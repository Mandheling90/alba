// ** MUI Imports
import { Grid } from '@mui/material'
import { FC } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'

import { useKioskManager } from 'src/hooks/useKioskManager'
import { useKioskPartTypeList } from 'src/service/kiosk/kioskManager'
import { useKioskTypeList } from 'src/service/kiosk/kioskService'
import KioskComponentList from './kioskComponent/KioskComponentList'
import KioskTypeList from './kioskType/KioskTypeList'
import KioskComponentModal from './modal/KioskComponentModal'

const KioskManager: FC = (): React.ReactElement => {
  const { data: kioskPartTypeList, refetch } = useKioskPartTypeList()
  const { data: kioskTypeList, refetch: kioskTypeRefetch } = useKioskTypeList()

  const kioskManager = useKioskManager()

  if (!kioskPartTypeList?.data || !kioskTypeList?.data) {
    return <></>
  }

  return (
    <StandardTemplate title={'키오스크 구성품 및 타입 관리'}>
      <KioskComponentModal
        kioskPartTypeList={kioskPartTypeList.data}
        isOpen={kioskManager.isKioskComponentModalOpen}
        onClose={() => {
          kioskManager.clear()
          kioskManager.setIsKioskComponentModalOpen(false)
        }}
        refetch={() => {
          refetch()
          kioskTypeRefetch()
        }}
      />

      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ mb: 4 }}>
          <KioskComponentList
            data={kioskPartTypeList.data}
            refetch={() => {
              refetch()
              kioskTypeRefetch()
            }}
          />

          <KioskTypeList data={kioskTypeList.data} refetch={kioskTypeRefetch} />
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}
export default KioskManager
