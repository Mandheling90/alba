import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { FC } from 'react'

interface IPageSizeSelect {
  pageSize: number
  onChange: (event: SelectChangeEvent) => void
}

const PageSizeSelect: FC<IPageSizeSelect> = ({ pageSize, onChange }) => {
  return (
    <Select value={String(pageSize)} size='small' onChange={onChange}>
      <MenuItem key={1} value={25}>
        25개씩
      </MenuItem>
      <MenuItem key={2} value={50}>
        50개씩
      </MenuItem>
      <MenuItem key={3} value={100}>
        100개씩
      </MenuItem>
    </Select>
  )
}

export default PageSizeSelect
