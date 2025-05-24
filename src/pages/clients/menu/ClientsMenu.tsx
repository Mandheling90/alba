import { Box, Button, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import { HorizontalScrollBox } from 'src/@core/styles/StyledComponents'
import { useClients } from 'src/hooks/useClients'
import { SEARCH_TYPE } from 'src/model/client/clientModel'
import ClientsButtonList from './ClientsButtonList'

interface IKioskMenu {
  refetch: () => void
}

const ClientsMenu: FC<IKioskMenu> = ({ refetch }) => {
  const { clientListReq, setClientListReq, clear } = useClients()
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState((router.query.keyword as string) || '')

  useEffect(() => {
    if (router.query.keyword) {
      setSearchKeyword(router.query.keyword as string)
      setClientListReq({
        ...clientListReq,
        keyword: router.query.keyword as string
      })
    } else {
      clear()
    }
  }, [router.query.keyword])

  const handleSearch = () => {
    if (searchKeyword === router.query.keyword) {
      refetch()

      return
    }

    setClientListReq({
      ...clientListReq,
      keyword: searchKeyword
    })
    router.push({
      pathname: router.pathname,
      query: { ...router.query, keyword: searchKeyword }
    })
  }

  return (
    <HorizontalScrollBox>
      <Box sx={{ minWidth: 'fit-content' }}>
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
      </Box>

      <Box sx={{ minWidth: 'fit-content' }}>
        <TextField
          size='small'
          sx={{ width: '325px' }}
          value={searchKeyword}
          placeholder='고객사명, 고객사 주소, 고객사 상태'
          onChange={e => {
            setSearchKeyword(e.target.value)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
      </Box>

      <Box sx={{ minWidth: 'fit-content' }}>
        <Button variant={'contained'} onClick={handleSearch}>
          검색
        </Button>
      </Box>

      <Box sx={{ minWidth: 'fit-content', ml: 'auto' }}>
        <ClientsButtonList refetch={refetch} />
      </Box>
    </HorizontalScrollBox>
  )
}

export default ClientsMenu
