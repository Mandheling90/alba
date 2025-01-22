import { Card, CardContent, CardHeader, IconButton } from '@mui/material'
import { grey } from '@mui/material/colors'
import { CSSProperties, FC } from 'react'
import IconCustom from 'src/layouts/components/IconCustom'

const CompactCard: FC<{
  title: string
  children: React.ReactNode
  style?: CSSProperties
  useAction?: boolean
  onAction?: () => void
}> = ({ title, children, style = {}, useAction = false, onAction }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader
      sx={{ pb: 1, pt: 1, borderBottom: '1px solid #fff', background: grey[200] }}
      titleTypographyProps={{ fontWeight: '600 !important' }}
      title={title}
      action={
        useAction && (
          <IconButton
            aria-label='settings'
            onClick={() => {
              onAction?.()
            }}
          >
            <IconCustom isCommon icon='screen-extender' style={{ width: '14px' }} />
          </IconButton>
        )
      }
    />

    <CardContent style={{ display: 'flex', height: '100%', paddingBottom: '2.25rem' }} sx={{ p: 0 }}>
      {children}
    </CardContent>
  </Card>
)

export default CompactCard
