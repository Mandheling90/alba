import { Box, Typography } from '@mui/material'
import React from 'react'

interface ImageDisplayProps {
  name: string
  background: string
  color: string
}

const BorderNameTag: React.FC<ImageDisplayProps> = ({ name, background, color }) => {
  return (
    <Box sx={{ padding: '4px 8px', borderRadius: '10px', background: background }}>
      <Typography variant='inherit' color={color} noWrap>
        {name}
      </Typography>
    </Box>
  )
}

export default BorderNameTag
