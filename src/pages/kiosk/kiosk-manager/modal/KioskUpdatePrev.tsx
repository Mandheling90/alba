// ** MUI Imports
import { Box, Card, Typography } from '@mui/material'
import { FC } from 'react'
import { useKioskManager } from 'src/hooks/useKioskManager'

interface IContentBody {
  onClick?: () => void
}

const KioskUpdatePrev: FC<IContentBody> = ({ onClick }) => {
  const kioskManager = useKioskManager()

  return (
    <Card sx={{ height: '100%', background: 'rgba(227, 227, 227, 1)', p: 5, display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h6' fontWeight={500} component='span' sx={{ mb: 3 }}>
        구성품 적용 키오스크 수: 4개
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>123123</Box>
    </Card>
  )
}

export default KioskUpdatePrev
