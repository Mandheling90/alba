import { Box, Button } from '@mui/material'
import { FC } from 'react'
import { useKiosk } from 'src/hooks/useKiosk'
import IconCustom from 'src/layouts/components/IconCustom'

interface IKioskButtonList {
  refetch: () => void
}

const ClientsButtonList: FC<IKioskButtonList> = ({ refetch }) => {
  const kiosk = useKiosk()

  return (
    <Box>
      <Button
        variant='contained'
        sx={{ ml: 3 }}
        startIcon={<IconCustom isCommon path='clients' icon='userAdd' />}
        onClick={() => {
          kiosk.setIsKioskManagerModalOpen(true)
        }}
      >
        고객사 추가
      </Button>

      <Button
        variant='contained'
        sx={{ ml: 3 }}
        startIcon={<IconCustom isCommon path='clients' icon='userDelete' />}
        onClick={async () => {
          await kiosk.kioskDelete(kiosk.checkedKioskIds, undefined, errorCallback => {
            alert(errorCallback.message)
          })
          refetch()
        }}
      >
        고객사 삭제
      </Button>
    </Box>
  )
}

export default ClientsButtonList
