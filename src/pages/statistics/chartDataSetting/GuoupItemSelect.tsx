import { Box, Checkbox, Typography } from '@mui/material'
import React from 'react'
import { chartColorList } from 'src/enum/statisticsEnum'

interface CollapsibleListProps {
  index: number
  id: number
  title: string
  isGroup: boolean
  isChecked: boolean
  onChecked: (checked: boolean, index: number) => void
}

const GuoupItemSelect: React.FC<CollapsibleListProps> = ({ index, id, title, isGroup, isChecked, onChecked }) => {
  return (
    <Box display='flex' alignItems='center' justifyContent='space-between' sx={{ height: '30px' }}>
      <Box display='flex' alignItems='center'>
        {!isGroup && (
          <Box
            sx={{
              width: 12,
              height: 12,
              backgroundColor: chartColorList[index],
              borderRadius: '50%'
            }}
          />
        )}

        <Typography variant='body1' ml={2}>
          {title}
        </Typography>
      </Box>
      {!isGroup && (
        <Checkbox
          checked={isChecked}
          onChange={e => {
            onChecked(e.target.checked, index)
          }}
        />
      )}
    </Box>
  )
}

export default GuoupItemSelect
