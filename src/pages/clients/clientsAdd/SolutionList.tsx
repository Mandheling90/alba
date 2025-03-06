import { Box, IconButton } from '@mui/material'
import { FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import { IService } from 'src/model/client/clientModel'
import SolutionRow from './SolutionRow'

interface ISolutionRow {
  services: IService[]
  onDelete: (serviceId: string) => void
  onAdd: () => void
  onTypeChange: (serviceId: string, newType: string) => void
  onUpdate: (serviceId: string, field: string, value: string) => void
}

const SolutionList: FC<ISolutionRow> = ({ services, onDelete, onAdd, onTypeChange, onUpdate }) => {
  return (
    <Box>
      {services.map(service => (
        <SolutionRow
          key={service.id}
          service={service}
          onDelete={onDelete}
          onTypeChange={onTypeChange}
          onUpdate={onUpdate}
        />
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <IconButton onClick={onAdd}>
          <IconCustom isCommon icon={'add-button'} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default SolutionList
