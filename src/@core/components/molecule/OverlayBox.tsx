import { Box, BoxProps } from '@mui/material'
import { ReactNode } from 'react'

interface OverlayBoxProps extends BoxProps {
  children: ReactNode
  color?: string
  opacity?: number
  marginTop?: string
}

const OverlayBox: React.FC<OverlayBoxProps> = ({
  children,
  color = '#9155FD',
  opacity = 0.2,
  marginTop = '-93px',
  ...props
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: `rgba(${color
          .replace('#', '')
          .match(/.{2}/g)
          ?.map(hex => parseInt(hex, 16))
          .join(', ')}, ${opacity})`,
        marginTop: marginTop,
        color: '#000',
        display: 'flex',
        p: 2,
        border: `1px solid ${color}`,
        borderRadius: '5px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: `10px solid ${color}${Math.round(opacity * 255)
            .toString(16)
            .padStart(2, '0')}`
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export default OverlayBox
