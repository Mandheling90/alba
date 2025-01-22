import { Box, Typography } from '@mui/material'
import React from 'react'

interface ISlideHeader {
  isFirst: boolean
  isEnd: boolean
  title: string
  onClick: (isNext: boolean) => void
}

const SlideHeader: React.FC<ISlideHeader> = ({ title, isFirst, isEnd, onClick }) => {
  return (
    <Box display='flex' alignItems='center' justifyContent='space-between' padding={2}>
      {/* {!isFirst && (
        <IconButton
          onClick={() => {
            onClick(false)
          }}
        >
          <IconCustom isCommon icon='arrow_right2' />
        </IconButton>
      )} */}
      <Typography variant='body1' fontWeight={500} align='center' sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      {/* {!isEnd && (
        <IconButton
          onClick={() => {
            onClick(true)
          }}
        >
          <IconCustom isCommon icon='arrow_left2' />
        </IconButton>
      )} */}
    </Box>
  )
}

export default SlideHeader
