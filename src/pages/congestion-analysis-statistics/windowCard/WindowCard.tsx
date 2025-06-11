import { Box, Card, IconButton, SxProps, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface IconAction {
  icon: ReactNode
  onClick: () => void
  tooltip?: string
}

interface WindowCardProps {
  title: ReactNode
  iconActions?: IconAction[]
  children?: ReactNode
  titleAlign?: 'left' | 'center'
  headerColor?: string
  sx?: SxProps
}

const WindowCard: React.FC<WindowCardProps> = ({
  title,
  iconActions = [],
  children,
  titleAlign = 'left',
  headerColor = 'primary.main',
  sx
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '350px', ...sx }}>
      {/* 헤더 영역 */}
      <Box
        sx={{
          bgcolor: headerColor,
          color: 'white',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '57px'
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{
            fontWeight: 'bold',
            flex: 1,
            textAlign: titleAlign,
            padding: '4px 10px'
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            ml: titleAlign === 'center' ? 'auto' : 0
          }}
        >
          {iconActions.map((action, index) => (
            <IconButton
              key={index}
              size='small'
              onClick={action.onClick}
              title={action.tooltip}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {action.icon}
            </IconButton>
          ))}
        </Box>
      </Box>

      {children}
    </Card>
  )
}

export default WindowCard
