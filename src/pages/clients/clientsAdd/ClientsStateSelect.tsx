import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { FC } from 'react'

interface IClientsSelect {
  value: string
  onChange: (event: SelectChangeEvent) => void
}

const ClientsSelect: FC<IClientsSelect> = ({ value, onChange }) => {
  return (
    <Select
      sx={{ minWidth: '185px', height: '40px', textAlign: 'center' }}
      value={value}
      size='small'
      onChange={onChange}
    >
      <MenuItem key={'1'} value={'1'}>
        계속사업자
      </MenuItem>
      <MenuItem key={'2'} value={'2'}>
        휴업
      </MenuItem>
      <MenuItem key={'3'} value={'3'}>
        폐업
      </MenuItem>
      <MenuItem key={'4'} value={'4'}>
        말소
      </MenuItem>
      <MenuItem key={'5'} value={'5'}>
        간주폐업
      </MenuItem>
    </Select>
  )
}

export default ClientsSelect
