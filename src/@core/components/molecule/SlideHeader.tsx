import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface ISlideHeader {
  isFirst: boolean
  isEnd: boolean
  title: string
  onClick: (isNext: boolean) => void
}

const SlideHeader: React.FC<ISlideHeader> = ({ title, isFirst, isEnd, onClick }) => {
  return (
    <Box display='flex' alignItems='center' justifyContent='space-between' padding={2}>
      {!isFirst && (
        <IconButton
          onClick={() => {
            onClick(false)
          }}
        >
          <IconCustom isCommon icon='arrow_left' />
        </IconButton>
      )}
      <Typography variant='h6' align='center' fontWeight={600} sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      {!isEnd && (
        <IconButton
          onClick={() => {
            onClick(true)
          }}
        >
          <IconCustom isCommon icon='arrow_right' />
        </IconButton>
      )}
    </Box>
  )
}

export default SlideHeader
