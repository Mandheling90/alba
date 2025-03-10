import { Box, IconButton, TextField } from '@mui/material'
import { FC } from 'react'
import CustomSelectBox from 'src/@core/components/molecule/CustomSelectBox'
import { grayTextFieldStyle, requiredCenterPlaceholderStyle } from 'src/@core/styles/TextFieldStyle'
import IconCustom from 'src/layouts/components/IconCustom'
import { IService, SERVICE_TYPE_LABELS } from 'src/model/client/clientModel'

interface ISolutionRow {
  service: IService
  onDelete: (serviceId: string) => void
  onTypeChange: (serviceId: string, newType: string) => void
  onUpdate: (serviceId: string, field: string, value: string) => void
}

const serviceOptions = Object.entries(SERVICE_TYPE_LABELS).map(([value, label], index) => ({
  key: String(index + 1),
  value: String(index + 1),
  label: label
}))

const SolutionRow: FC<ISolutionRow> = ({ service, onDelete, onTypeChange, onUpdate }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
      <CustomSelectBox
        value={service.serviceType}
        onChange={e => onTypeChange(service.id, e.target.value)}
        options={serviceOptions}
        width='300px'

        // placeholder='분석 서비스 선택'
        // placeholderColor='#757575'
      />

      <TextField
        size='small'
        value={service.name}
        onChange={e => onUpdate(service.id, 'name', e.target.value)}
        placeholder='분석카메라 이름'
        sx={{ ...requiredCenterPlaceholderStyle, ...grayTextFieldStyle }}
      />

      <TextField
        size='small'
        value={service.address || ''}
        onChange={e => onUpdate(service.id, 'address', e.target.value)}
        placeholder='분석카메라 주소'
        sx={{ ...requiredCenterPlaceholderStyle, ...grayTextFieldStyle }}
      />

      <TextField
        size='small'
        value={service.rtsAddress || ''}
        onChange={e => onUpdate(service.id, 'rtsAddress', e.target.value)}
        placeholder='분석카메라 RTS 주소'
        sx={{ ...grayTextFieldStyle }}
      />

      <TextField
        size='small'
        value={service.description || ''}
        onChange={e => onUpdate(service.id, 'description', e.target.value)}
        placeholder='카메라 설명'
        sx={{ ...grayTextFieldStyle }}
      />

      <IconButton onClick={() => onDelete(service.id)}>
        <IconCustom isCommon icon={'DeleteOutline'} />
      </IconButton>
    </Box>
  )
}

export default SolutionRow
