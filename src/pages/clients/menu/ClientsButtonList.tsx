import { Box, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useClients } from 'src/hooks/useClients'
import IconCustom from 'src/layouts/components/IconCustom'
import { useClientDelete } from 'src/service/client/clientService'

interface IKioskButtonList {
  refetch: () => void
}

const ClientsButtonList: FC<IKioskButtonList> = ({ refetch }) => {
  const { mutateAsync: deleteClient } = useClientDelete()

  const { selectClientData } = useClients()
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
          await deleteClient({ companyNos: selectClientData.map(client => client.companyNo) })
          refetch()
        }}
      >
        고객사 삭제
      </Button>
    </Box>
  )
}

export default ClientsButtonList
