// ** MUI Imports
import { Box, Card, IconButton, TextField } from '@mui/material'
import { FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import { UserListAll } from 'src/model/userSetting/userSettingModel'
import ClientSimpleList from 'src/pages/user-setting/client/table/ClientSimpleList'

interface IClientListGrid {
  data: UserListAll[]
  refetch: () => void
  selectRowEvent: (row: any) => void
}

const ClientListGrid: FC<IClientListGrid> = ({ data, refetch, selectRowEvent }): React.ReactElement => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
      <Card sx={{ flex: 1, minHeight: 0 }}>
        <ClientSimpleList data={data} refetch={refetch} selectRowEvent={selectRowEvent} />
      </Card>
    </Box>
  )
}
export default ClientListGrid
