import { Box, Card, SxProps, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface IconAction {
  icon: ReactNode
}

interface WindowCardProps {
  title: ReactNode
  iconActions?: IconAction[]
  children?: ReactNode
  titleAlign?: 'left' | 'center'
  headerColor?: string
  sx?: SxProps
  isRefreshOpen?: boolean
  setIsRefreshOpen?: () => void
}

const WindowCard: React.FC<WindowCardProps> = ({
  title,
  iconActions = [],
  children,
  titleAlign = 'left',
  headerColor = 'primary.main',
  sx,
  isRefreshOpen,
  setIsRefreshOpen
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
          {iconActions.map((action, index) => action.icon)}
        </Box>
      </Box>

      {children}
    </Card>
  )
}

export default WindowCard
