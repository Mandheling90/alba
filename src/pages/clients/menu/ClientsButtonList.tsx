import { Box, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useClients } from 'src/hooks/useClients'
import IconCustom from 'src/layouts/components/IconCustom'
import { useCustomModal, useModal } from 'src/hooks/useModal'
import { useClientDelete } from 'src/service/client/clientService'


interface IKioskButtonList {
  refetch: () => void
}

const ClientsButtonList: FC<IKioskButtonList> = ({ refetch }) => {
const { setSimpleDialogModalProps } = useModal()
const{setCustomSimpleDialogModalProps} = useCustomModal();
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
          if(selectClientData.length > 0){
            setCustomSimpleDialogModalProps({
              open: true,
              title: '고객사 정보 삭제 확인',
              contents: '선택하신 고객사 정보를 정말 삭제하시겠습니까? \r\n 삭제 시 고객사 정보 및 고객사 관련 카메라 정보 및 통계정보도 모두 삭제됩니다.',
              actions: [
                { label: "취소", variant: "outlined"},
                { label: "삭제", variant: "contained", 
                  onClick: async () => {
                    try {
                      await deleteClient({ companyNos: selectClientData.map(c => c.companyNo) })
                      setSimpleDialogModalProps({
                        open: true,
                        title: '고객사 정보 삭제 확인',
                        contents: '선택하신 고객사 정보가 모두 삭제되었습니다'
                      })
                      await refetch()
                    } catch (error) { 
                      console.log(error)
                    }
                    }
                  }
                ]
            })
          }else{
            setSimpleDialogModalProps({
              open: true,
              title: '고객사 선택 후 삭제 요청',
              contents: '선택된 고객사가 없습니다. 삭제할 고객사를 먼저 선택해 주세요.'
            })
          }

        }}
      >
        고객사 삭제
      </Button>
    </Box>
  )
}

export default ClientsButtonList
