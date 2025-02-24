import { Box, Button, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { useClients } from 'src/hooks/useClients'
import { excludeId } from 'src/utils/CommonUtil'
import ClientsButtonList from './ClientsButtonList'
import ClientsSelect from './ClientsSelect'

interface IKioskMenu {
  refetch: () => void
}

const ClientsMenu: FC<IKioskMenu> = ({ refetch }) => {
  const theme = useTheme()
  const clients = useClients()
  const { sort } = clients.kioskSort

  const [labelArray, setLabelArray] = useState(
    clients.initialKioskList.map(item => ({ label: `${item.name}, ${item.location}`, id: item.id }))
  )

  useEffect(() => {
    if (typeof clients.kioskListReq.status === 'number') {
      setLabelArray(
        clients.initialKioskList
          .filter(list => list.kioskStatus === clients.kioskListReq.status)
          .map(item => ({ label: `${item.name}, ${item.location}`, id: item.id }))
      )
    }
  }, [clients.kioskListReq.status, clients.initialKioskList])

  const autocompleteRef = useRef<any>(null)

  const handleClear = () => {
    // 자식 컴포넌트의 clearInput 함수를 호출
    autocompleteRef.current?.clearInput()
  }

  return (
    <ClientsMenuList>
      <ClientsSelect
        onChange={event => {
          handleClear()
          clients.setKioskListReq(
            excludeId(
              excludeId(excludeId({ ...clients.kioskListReq, status: Number(event.target.value) }, 'keyword'), 'id'),
              'status',
              KIOSK_STATUS.ALL
            )
          )
        }}
      />

      <TextField
        size='small'
        sx={{ width: '325px', ml: 5 }}
        value={clients.kioskListReq.keyword}
        placeholder='고객사명, 고객사 주소, 고객사 상태'
        onChange={e => clients.setKioskListReq({ ...clients.kioskListReq, keyword: e.target.value })}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            // contents.setContentListReqPram({ ...contents.contentListReqPram, ...reqPram })
          }
        }}
      />

      <Button
        sx={{ ml: 5 }}
        variant={'contained'}
        onClick={() => {
          // contents.setContentListReqPram({ ...contents.contentListReqPram, ...reqPram })
        }}
      >
        검색
      </Button>

      <Box sx={{ marginLeft: 'auto' }}>
        <ClientsButtonList refetch={refetch} />
      </Box>
    </ClientsMenuList>
  )
}

const ClientsMenuList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%; /* 전체 너비를 차지하도록 설정 */
`

export default ClientsMenu
