import { Box, IconButton, SelectChangeEvent, TextField } from '@mui/material'
import { FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'
import SolutionSelect from './SolutionSelect'

interface ISolutionRow {
  onDelete: (event: SelectChangeEvent) => void
}

const SolutionRow: FC<ISolutionRow> = ({ onDelete }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <SolutionSelect
        onChange={() => {
          console.log('1')
        }}
      />

      <TextField
        size='small'
        sx={{
          width: '325px',
          '& .MuiInputBase-input::placeholder': {
            color: 'red'
          },
          '& .MuiInputBase-input': {
            textAlign: 'center'
          }
        }}
        placeholder='분석카메라 이름'
        onChange={e => {
          console.log('')
        }}
      />

      <TextField
        size='small'
        sx={{
          width: '325px',
          '& .MuiInputBase-input::placeholder': {
            color: 'red'
          },
          '& .MuiInputBase-input': {
            textAlign: 'center'
          }
        }}
        placeholder='분석카메라 주소'
        onChange={e => {
          console.log('')
        }}
      />

      <TextField
        size='small'
        sx={{
          width: '325px',
          '& .MuiInputBase-input': {
            textAlign: 'center'
          }
        }}
        placeholder='분석카메라 RTS 주소'
        onChange={e => {
          console.log('')
        }}
      />

      <TextField
        size='small'
        sx={{
          width: '325px',
          '& .MuiInputBase-input': {
            textAlign: 'center'
          }
        }}
        placeholder='카메라 설명'
        onChange={e => {
          console.log('')
        }}
      />

      <IconButton
        onClick={() => {
          console.log('delete')
        }}
      >
        <IconCustom isCommon icon={'DeleteOutline'} />
      </IconButton>
    </Box>
  )
}

export default SolutionRow
