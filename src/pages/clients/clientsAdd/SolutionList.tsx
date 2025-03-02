import { Box, IconButton, SelectChangeEvent } from '@mui/material'
import { FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import SolutionRow from './SolutionRow'

interface ISolutionRow {
  onDelete: (event: SelectChangeEvent) => void
}

const SolutionList: FC<ISolutionRow> = ({ onDelete }) => {
  return (
    <Box>
      <SolutionRow
        onDelete={() => {
          console.log('delete')
        }}
      />
      <SolutionRow
        onDelete={() => {
          console.log('delete')
        }}
      />
      <SolutionRow
        onDelete={() => {
          console.log('delete')
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <IconButton
          onClick={() => {
            console.log('add')
          }}
        >
          <IconCustom isCommon icon={'add-button'} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default SolutionList
