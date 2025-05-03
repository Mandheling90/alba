// ** MUI Imports
import { Box, Card, IconButton, TextField } from '@mui/material'
import { forwardRef, Suspense, useContext, useImperativeHandle, useRef, useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

import styled from '@emotion/styled'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useCustomerList } from 'src/service/queries'
import ScheduleContext from '../contexts/scheduleContext'

interface ICustomerSearcherHandle {
  refetch: () => void
}
const CustomerSearcher = () => {
  const [keyword, setKeyword] = useState('')
  const ref = useRef<ICustomerSearcherHandle>(null)

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        size='small'
        fullWidth
        value={keyword}
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
        onChange={e => {
          setKeyword(e.target.value)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            ref.current?.refetch()
          }
        }}
      />
      <Card sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Suspense fallback={<div>loading...</div>}>
          <SearchedList keyword={keyword} />
        </Suspense>
      </Card>
    </Box>
  )
}

const SearchedList = forwardRef(({ keyword }: { keyword: string }, ref) => {
  const { data, refetch } = useCustomerList(keyword)
  const { setSelectedCustomerInfo } = useContext(ScheduleContext)
  const list = data?.data ?? []
  useImperativeHandle(ref, () => {
    return {
      refetch
    }
  })

  return (
    <ListContainer>
      <CustomTable
        rows={list}
        columns={[
          {
            field: 'id',
            headerName: '고객사 ID',
            width: 100
          },
          {
            field: 'name',
            headerName: '고객사명',
            flex: 1
          }
        ]}
        isAllView
        enablePointer
        showMoreButton
        selectRowEvent={row => {
          setSelectedCustomerInfo({
            customerId: row.id,
            customerName: row.name
          })
        }}
      />
    </ListContainer>
  )
})

const ListContainer = styled.section`
  width: 100%;
`

export default CustomerSearcher
