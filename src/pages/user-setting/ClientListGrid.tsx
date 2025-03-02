// ** MUI Imports
import { Box, IconButton, TextField } from '@mui/material'
import { FC } from 'react'
import ClientList from 'src/@core/components/userSetting/table/ClientList'
import IconCustom from 'src/layouts/components/IconCustom'
import { UserListAll } from 'src/model/userSetting/userSettingModel'

interface IClientListGrid {
  data: UserListAll[]
  refetch: () => void
}

const ClientListGrid: FC<IClientListGrid> = ({ data, refetch }): React.ReactElement => {
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

      <ClientList data={data} refetch={refetch} />
    </Box>
  )
}
export default ClientListGrid
