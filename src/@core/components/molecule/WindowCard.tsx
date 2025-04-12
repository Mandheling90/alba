import { Box, Card, CardContent, Typography } from '@mui/material'
import { FC, ReactNode } from 'react'

interface WindowCardProps {
  title?: string | ReactNode
  leftContent?: ReactNode
  rightContent?: ReactNode
  children: ReactNode
}

const WindowCard: FC<WindowCardProps> = ({ title, leftContent, rightContent, children }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <Box
        sx={{
          background: '#F9FAFC',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        {leftContent && <Box>{leftContent}</Box>}
        {typeof title === 'string' ? (
          <Typography variant='h6' fontWeight='500' fontSize={20}>
            {title}
          </Typography>
        ) : (
          title
        )}
        <Box sx={{ flex: 1 }} /> {/* 빈 공간을 만들어 오른쪽 컨텐츠를 우측 정렬 */}
        {rightContent && <Box>{rightContent}</Box>}
      </Box>
      <CardContent sx={{ textAlign: 'center' }}>{children}</CardContent>
    </Card>
  )
}

export default WindowCard
