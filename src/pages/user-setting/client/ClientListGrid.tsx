// ** MUI Imports
import { Box, Card, IconButton, TextField } from '@mui/material'
import { FC, useState } from 'react'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'

import ClientSimpleList from 'src/pages/user-setting/client/table/ClientSimpleList'
import { useCompanySearchList } from 'src/service/client/clientService'

const ClientListGrid: FC = (): React.ReactElement => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const { data, refetch } = useCompanySearchList({ keyword: '' })

  const { setCompanyId, setCompanyName, setCompanyNo } = useLayout()

  const handleSelectClientGrid = (row: any) => {
    setCompanyNo(row.companyNo)
    setCompanyId(row.companyId)
    setCompanyName(row.companyName)
  }

  const filteredData =
    data?.data?.filter(
      item =>
        item.companyId?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.companyName?.toLowerCase().includes(searchKeyword.toLowerCase())
    ) ?? []

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        size='small'
        fullWidth
        value={searchKeyword}
        onChange={e => setSearchKeyword(e.target.value)}
        placeholder='고객사 ID, 고객사명'
        InputProps={{
          endAdornment: (
            <IconButton>
              <IconCustom isCommon icon='search' />
            </IconButton>
          )
        }}
      />
      <Card sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <ClientSimpleList data={filteredData} refetch={refetch} selectRowEvent={handleSelectClientGrid} />
      </Card>
    </Box>
  )
}
export default ClientListGrid
