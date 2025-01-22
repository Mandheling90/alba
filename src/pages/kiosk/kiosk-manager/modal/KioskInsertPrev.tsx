// ** MUI Imports
import { Box, Card, Typography } from '@mui/material'
import { FC } from 'react'
import { YN } from 'src/enum/commonEnum'
import { useKioskManager } from 'src/hooks/useKioskManager'
import { MKioskPartTypeList } from 'src/model/kiosk/kioskManagerModel'
import KioskComponentCard from '../kioskComponent/KioskComponentCard'

interface IContentBody {
  kioskPartTypeList: MKioskPartTypeList[]
  onClick?: () => void
}

const KioskInsertPrev: FC<IContentBody> = ({ kioskPartTypeList, onClick }) => {
  const kioskManager = useKioskManager()
  const kioskPartTypeReq = kioskManager.kioskPartTypeReq

  const tempKioskPartTypeList = kioskPartTypeList.find(item => item.id === kioskPartTypeReq.id)?.partList ?? []

  const data = {
    id: kioskPartTypeReq.id ?? 0,
    name: kioskPartTypeReq.name ?? '',
    iconFileName: kioskPartTypeReq.iconFileName ?? '',
    partList: [
      ...tempKioskPartTypeList,
      {
        id: 0,
        dataStatus: YN.Y,
        inUse: 0,
        name: kioskPartTypeReq.partListName ?? '',
        specification: kioskPartTypeReq.specification ?? ''
      }
    ]
  }

  return (
    <Card sx={{ height: '100%', background: 'rgba(227, 227, 227, 1)', p: 5, display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h6' fontWeight={500} component='span' sx={{ mb: 3 }}>
        미리보기
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 5 }}>
          <KioskComponentCard data={data} readOnly />
        </Box>

        <Box>
          <KioskComponentCard data={data} isDefaultDetail readOnly />
        </Box>
      </Box>
    </Card>
  )
}

export default KioskInsertPrev
