import { Box, Button, TextField } from '@mui/material'
import { FC, useState } from 'react'
import styled from 'styled-components'

import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import { useClients } from 'src/hooks/useClients'
import { SEARCH_TYPE } from 'src/model/client/clientModel'
import ClientsButtonList from './ClientsButtonList'

interface IKioskMenu {
  refetch: () => void
}

const ClientsMenu: FC<IKioskMenu> = ({ refetch }) => {
  const { clientListReq, setClientListReq } = useClients()

  const [searchKeyword, setSearchKeyword] = useState('')

  return (
    <ClientsMenuList>
      <CustomSelectBox
        width='185px'
        value={clientListReq.searchType}
        onChange={event => {
          setClientListReq({
            ...clientListReq,
            searchType: event.target.value as SEARCH_TYPE
          })
        }}
        options={[
          { key: '1', value: SEARCH_TYPE.ALL, label: '전체' },
          { key: '2', value: SEARCH_TYPE.COMPANY_NAME, label: '고객사명' },
          { key: '3', value: SEARCH_TYPE.COMPANY_ADDRESS, label: '고객사주소' },
          { key: '4', value: SEARCH_TYPE.ACCOUNT_USE_TYPE, label: '고객사상태' }
        ]}
      />

      <TextField
        size='small'
        sx={{ width: '325px', ml: 5 }}
        value={searchKeyword}
        placeholder='고객사명, 고객사 주소, 고객사 상태'
        onChange={e => {
          setSearchKeyword(e.target.value)
        }}
      />

      <Button
        sx={{ ml: 5 }}
        variant={'contained'}
        onClick={() => {
          setClientListReq({
            ...clientListReq,
            keyword: searchKeyword
          })
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
