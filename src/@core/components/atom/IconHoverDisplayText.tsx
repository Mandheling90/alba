// ** MUI Imports
import { Box, IconButton, Typography } from '@mui/material'
import { FC, useState } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

interface IIconHoverDisplayText {
  icon: string
  iconHover: string
  text: string
  onClick: () => void
}

const IconHoverDisplayText: FC<IIconHoverDisplayText> = ({ icon, iconHover, text, onClick }): React.ReactElement => {
  const [hover, setHover] = useState(false)

  return (
    <Box display='flex' alignItems='center'>
      <IconButton
        sx={{ p: 0 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      >
        <IconCustom path='statistics' icon={hover ? iconHover : icon} />
      </IconButton>

      {/* 마우스 오버 시에만 텍스트가 부드럽게 나타나고 영역을 차지하도록 구현 */}
      <Box
        sx={{
          marginLeft: hover ? '8px' : 0,
          width: hover ? '30px' : '0px', // hover 시 영역을 차지
          opacity: hover ? 1 : 0, // 부드러운 전환을 위해 opacity
          overflow: 'hidden', // hover하지 않을 때 영역을 숨김
          transition: 'width 0.3s ease, opacity 0.3s ease' // 부드러운 애니메이션
        }}
      >
        <Typography variant='body2' whiteSpace={'nowrap'} display={'inline-block'}>
          {text}
        </Typography>
      </Box>
    </Box>
  )
}

export default IconHoverDisplayText
