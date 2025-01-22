import { Box, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import { useKioskContentsList } from 'src/service/kiosk/kioskService'
import KioskCardContentsList from '../../table/KioskCardContentsList'

const KioskPromoInfo: React.FC<{ kioskId: number; isView: boolean }> = ({ kioskId, isView }) => {
  const { data, refetch } = useKioskContentsList({ contents: kioskId })
  const router = useRouter()

  return (
    <Box key={`list-box-${kioskId}`}>
      <Box>
        <Typography component='span' variant='body1' fontWeight='bold'>
          홍보물 설정
        </Typography>
        <IconButton
          onClick={() => {
            router.push({
              pathname: 'kiosk/kiosk-contents-manager',
              query: { id: kioskId }
            })
          }}
        >
          <IconCustom path='kiosk' icon='KioskSettingPurpleDefault' />
        </IconButton>
      </Box>
      <Box>
        <KioskCardContentsList key={`list-${kioskId}`} data={data?.data || []} refetch={refetch} />
      </Box>
    </Box>
  )
}

export default KioskPromoInfo
