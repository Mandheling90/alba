import { Box, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useClients } from 'src/hooks/useClients'
import IconCustom from 'src/layouts/components/IconCustom'

interface IKioskButtonList {
  refetch: () => void
}

const ClientsButtonList: FC<IKioskButtonList> = ({ refetch }) => {
  const clients = useClients()
  const router = useRouter()

  return (
    <Box>
      <Button
        variant='contained'
        sx={{ ml: 3 }}
        startIcon={<IconCustom isCommon path='clients' icon='userAdd' />}
        onClick={() => {
          router.push({
            pathname: 'clients/clientsAdd'
          })
        }}
      >
        고객사 추가
      </Button>

      <Button
        variant='contained'
        sx={{ ml: 3 }}
        startIcon={<IconCustom isCommon path='clients' icon='userDelete' />}
        onClick={async () => {
          // await kiosk.kioskDelete(kiosk.checkedKioskIds, undefined, errorCallback => {
          //   alert(errorCallback.message)
          // })
          // refetch()
        }}
      >
        고객사 삭제
      </Button>
    </Box>
  )
}

export default ClientsButtonList
