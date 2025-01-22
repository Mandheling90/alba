import { Box, Button } from '@mui/material'
import { FC } from 'react'
import { useKiosk } from 'src/hooks/useKiosk'
import IconCustom from 'src/layouts/components/IconCustom'

interface IKioskButtonList {
  refetch: () => void
}

const KioskButtonList: FC<IKioskButtonList> = ({ refetch }) => {
  const kiosk = useKiosk()

  return (
    <Box>
      <Button
        variant='contained'
        sx={{ ml: 3 }}
        startIcon={<IconCustom isCommon icon='plus' />}
        onClick={() => {
          kiosk.setIsKioskManagerModalOpen(true)
        }}
      >
        키오스크 추가
      </Button>

      <Button
        variant='contained'
        sx={{ ml: 3 }}
        onClick={async () => {
          await kiosk.kioskDelete(kiosk.checkedKioskIds, undefined, errorCallback => {
            alert(errorCallback.message)
          })
          refetch()
        }}
      >
        키오스크 삭제
      </Button>
    </Box>
  )
}

export default KioskButtonList
