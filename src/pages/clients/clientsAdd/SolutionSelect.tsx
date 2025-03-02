import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { FC } from 'react'

import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { useClients } from 'src/hooks/useClients'

interface IClientsSelect {
  onChange: (event: SelectChangeEvent) => void
}

const ClientsSelect: FC<IClientsSelect> = ({ onChange }) => {
  const clients = useClients()

  return (
    <Select
      sx={{
        minWidth: '185px',
        height: '40px',
        textAlign: 'center',
        '& .MuiSelect-select': {
          color: clients.kioskListReq.status === KIOSK_STATUS.ALL ? 'red' : 'inherit'
        }
      }}
      value={String(clients.kioskListReq.status ?? KIOSK_STATUS.ALL)}
      size='small'
      onChange={onChange}
      displayEmpty
      renderValue={selected => {
        if (!selected || selected === String(KIOSK_STATUS.ALL)) {
          return '솔루션 선택'
        }

        return selected
      }}
    >
      <MenuItem key={1} value={KIOSK_STATUS.ALL}>
        전체
      </MenuItem>
      <MenuItem key={2} value={KIOSK_STATUS.ENABLED}>
        고객사명
      </MenuItem>
      <MenuItem key={3} value={KIOSK_STATUS.DISABLED}>
        고객사주소
      </MenuItem>
      <MenuItem key={4} value={KIOSK_STATUS.ERROR}>
        고객사상태
      </MenuItem>
    </Select>
  )
}

export default ClientsSelect
