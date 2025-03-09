// ** MUI Imports
import { Box, IconButton, TextField } from '@mui/material'
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
    <Box>
      <TextField
        size='small'
        fullWidth
        sx={{ mb: 5 }}
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

      <ClientSimpleList data={data} refetch={refetch} selectRowEvent={selectRowEvent} />
    </Box>
  )
}
export default ClientListGrid
