// ** MUI Imports
import { MenuItem } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import { useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string, key: string) => void
  refetch: () => void
  onExport?: () => void
  isCrowd: boolean
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value, onExport, isCrowd } = props

  const theme = useTheme()

  const [handleKey, setHandleKey] = useState('all')

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch' }} gap={3} m={3}>
      <Button
        color='secondary'
        variant='outlined'
        startIcon={<IconCustom isCommon icon='IosShare' />}
        onClick={() => {
          onExport?.()
        }}
      >
        Export
      </Button>

      <Select
        sx={{ background: theme.palette.background.paper, minWidth: '185px', height: '40px' }}
        value={handleKey}
        size='small'
        onChange={(event: SelectChangeEvent) => {
          setHandleKey(event.target.value)
        }}
      >
        <MenuItem value={'all'}>전체</MenuItem>
        <MenuItem value={'kioskId'}>키오스크 ID</MenuItem>
        <MenuItem value={'kioskLocation'}>키오스크위치</MenuItem>
        {isCrowd ? (
          <MenuItem value={'lineName'}>분석위치 및 방향</MenuItem>
        ) : (
          <MenuItem value={'areaName'}>분석위치</MenuItem>
        )}
      </Select>
      <TextField
        size='small'
        value={value}
        placeholder='검색'
        onChange={e => handleFilter(e.target.value, handleKey)}
      />
    </Box>
  )
}

export default TableHeader
