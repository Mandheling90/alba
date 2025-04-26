// ** MUI Imports
import { Box, Card, IconButton, TextField } from '@mui/material'
import { FC, useEffect } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'

import ClientSimpleList from 'src/pages/user-setting/client/table/ClientSimpleList'
import { useCompanySearchList } from 'src/service/client/clientService'

const ClientListGrid: FC = (): React.ReactElement => {
  const { data, refetch } = useCompanySearchList({ keyword: '' })

  const { layoutDisplay, setCompanyId, setCompanyName, setCompanyNo, companyId, companyName, companyNo } = useLayout()
  const { user } = useAuth()

  useEffect(() => {
    if (companyId && companyName && companyNo) {
      setCompanyNo(companyNo)
      setCompanyId(companyId)
      setCompanyName(companyName)
    } else {
      if (user?.userInfo?.companyNo && user?.userInfo?.companyId && user?.userInfo?.companyName) {
        setCompanyNo(user?.userInfo?.companyNo)
        setCompanyId(user?.userInfo?.companyId)
        setCompanyName(user?.userInfo?.companyName)
      }
    }
  }, [])

  const handleSelectClientGrid = (row: any) => {
    setCompanyNo(row.companyNo)
    setCompanyId(row.companyId)
    setCompanyName(row.companyName)
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        size='small'
        fullWidth
        value={''}
        placeholder='고객사 ID, 고객사명'
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => {
                console.log('search')
              }}
            >
              <IconCustom isCommon icon='search' />
            </IconButton>
          )
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            // contents.setContentListReqPram({ ...contents.contentListReqPram, ...reqPram })
          }
        }}
      />
      <Card sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <ClientSimpleList data={data?.data ?? []} refetch={refetch} selectRowEvent={handleSelectClientGrid} />
      </Card>
    </Box>
  )
}
export default ClientListGrid
