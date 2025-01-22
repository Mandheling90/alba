import { Card, CardContent, CardHeader, SxProps, Theme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { CSSProperties, FC } from 'react'

const CustomCard: FC<{
  title: string
  subTitle?: string
  children: React.ReactNode
  style?: CSSProperties
  contentStyle?: SxProps<Theme>
}> = ({ title, subTitle, children, style = {}, contentStyle = {} }) => (
  <Card style={style}>
    <CardHeader
      sx={cardHeaderSx}
      titleTypographyProps={{ fontWeight: '600 !important' }}
      title={
        <>
          {title} <span style={{ fontSize: 14, color: 'rgba(58, 53, 65, 0.6)' }}>{subTitle && subTitle}</span>
        </>
      }
    />
    <CardContent style={{ paddingTop: '10px' }} sx={{ ...contentStyle }}>
      {children}
    </CardContent>
  </Card>
)

const cardHeaderSx = {
  pb: 1,
  pt: 1,
  borderBottom: '1px solid #fff',
  background: grey[200]
}

export default CustomCard
