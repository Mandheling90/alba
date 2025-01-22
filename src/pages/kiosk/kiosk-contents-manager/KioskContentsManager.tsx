// ** MUI Imports

import { Box, Button, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'

import { useKiosk } from 'src/hooks/useKiosk'
import KioskContentsBody from './KioskContentsBody'

const KioskContentsManager: FC = () => {
  const kiosk = useKiosk()
  const router = useRouter()
  const { id } = router.query
  const kioskId = Number(id as string)

  return (
    <StandardTemplate title={`키오스크내 홍보물 관리`}>
      <Grid container>
        <Grid xs={12} item>
          <KioskContentsBody kioskId={kioskId} />
        </Grid>
        <Grid xs={12} item>
          <Box gap={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
            <Button
              variant='contained'
              onClick={async () => {
                await kiosk.kioskContentUpdate(kioskId, errorCallback => {
                  alert(errorCallback.message)
                })
                if (kiosk.kioskContentDeleteIds.length > 0) {
                  await kiosk.kioskContentsDelete(kioskId, kiosk.kioskContentDeleteIds, errorCallback => {
                    alert(errorCallback.message)
                  })
                }

                router.back()
              }}
            >
              저장
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                router.back()
              }}
            >
              취소
            </Button>
          </Box>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}

export default KioskContentsManager
