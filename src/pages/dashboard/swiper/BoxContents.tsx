import { Box, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface IBoxContents {
  titles?: string[]
  centerText?: string | number
  bottomTexts?: string[]
  color?: string
  onClick?: (isSelected: boolean) => void
}

const BoxContents: FC<IBoxContents> = ({
  titles = [],
  centerText = '',
  bottomTexts = [],
  color = '#000000',
  onClick
}): React.ReactElement => {
  const [isSelected, setIsSelected] = useState<boolean>(false)

  return (
    <Box
      onClick={() => {
        const newIsSelected = !isSelected
        setIsSelected(newIsSelected)
        onClick?.(newIsSelected)
      }}
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        cursor: 'pointer',
        border: '2px solid transparent',
        borderColor: isSelected ? color : '',
        backgroundColor: isSelected ? `${color}20` : 'transparent',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease',
        '&:hover .center-text': {
          transform: 'translate(-50%, -50%) scale(1.1)'
        },
      }}
    >
      <Stack
        spacing={0.5}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
        }}
      >
        {titles.map((title, index) => (
          <Typography
            key={index}
            variant='subtitle1'
            sx={{
              fontWeight: 'bold',
              lineHeight: 1.2,
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            {title}
          </Typography>
        ))}
      </Stack>

      {/* 중앙 텍스트 추가 */}
      <Box
        className='center-text'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          transition: 'transform 0.2s ease'
        }}
      >
        <Typography
          variant='h4'
          sx={{
            fontWeight: 'bold',
            color: color
          }}
        >
          {centerText}
        </Typography>
      </Box>

      {/* 하단 텍스트 추가 */}
      <Stack
        spacing={0.5}
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          maxWidth: '300px',
          textAlign: 'left'
        }}
      >
        {bottomTexts.map((text, index) => (
          <Typography
            key={index}
            variant='body1'
            sx={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            {text}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}

export default BoxContents
