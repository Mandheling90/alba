import { Box, Typography } from '@mui/material'
import React from 'react'

interface CircleNumberProps {
  text: string | number
  background?: string
  color?: string // 원형 배경 색상
}

const CircleNumber: React.FC<CircleNumberProps> = ({ text, background = '#ff0000 ', color = '#fff' }) => {
  return (
    <Box
      sx={{
        mx: 2,
        width: 15, // 원의 너비
        height: 15, // 원의 높이
        borderRadius: '50%', // 원형 모양
        background: background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography color={color} fontSize={10}>
        {text}
      </Typography>
    </Box>
  )
}

export default CircleNumber
