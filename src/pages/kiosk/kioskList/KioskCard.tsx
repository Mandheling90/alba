import { Box, Card, CardContent, Typography } from '@mui/material'
import { styled, SxProps, Theme, useTheme } from '@mui/material/styles'
import React, { FC, useEffect, useState } from 'react'
import { MKiosk } from 'src/model/kiosk/kioskModel'
import { cardHeaderSxFn } from '../util/kioskStyles'
import KioskCardHeader from './KioskCardHeader'
import KioskCardSlider from './kioskCardSlider/KioskCardSlider'

interface IKioskCard {
  kioskData: MKiosk
  refetch: () => void
}

interface ITypeStyleInfo {
  headerSx: SxProps<Theme>
  contentSx?: SxProps<Theme>
  kioskInfoIcon: string
  kioskMainIcon: string
  kioskSettingIcon: string
}

const KioskCard: FC<IKioskCard> = ({ kioskData, refetch }): React.ReactElement => {
  const theme = useTheme()

  const [styleInfo, setStyleInfo] = useState<ITypeStyleInfo>()

  useEffect(() => {
    setStyleInfo(cardHeaderSxFn(kioskData.kioskStatus, theme))
  }, [kioskData, theme])

  return (
    <Card sx={{ width: '415px', height: '480px' }}>
      <KioskCardHeader kioskData={kioskData} styleInfo={styleInfo} refetch={refetch} />

      <CardContent
        sx={{
          ...styleInfo?.contentSx
        }}
      >
        <CardContentWrapper>
          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle2' fontWeight='bold' fontSize={16}>
              <Typography component='span' variant='body1' fontWeight='bold'>
                설치위치 :{' '}
              </Typography>
              {kioskData.location}
            </Typography>
          </Box>

          <KioskCardSlider kioskData={kioskData} />
        </CardContentWrapper>
      </CardContent>
    </Card>
  )
}

const CardContentWrapper = styled('div')({
  paddingTop: '10px'
})

// React.memo와 props 비교 함수 적용
export default React.memo(KioskCard, (prevProps, nextProps) => {
  // props 변경 조건을 지정하여 변경된 경우에만 렌더링
  return prevProps.kioskData === nextProps.kioskData
})
