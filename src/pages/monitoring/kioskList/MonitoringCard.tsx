// ** MUI Imports
import { Box, Card, CardContent, Typography } from '@mui/material'
import { styled, SxProps, Theme, useTheme } from '@mui/material/styles'
import { FC, useEffect, useState } from 'react'
import { MMonitoringHealth } from 'src/model/monitoring/monitoringModel'
import { cardHeaderSxFn } from '../util/kioskStyles'
import KioskCardHeader from './KioskCardHeader'
import MonitoringContentCard from './MonitoringContentCard'

interface IMonitoringCard {
  kioskData: MMonitoringHealth
  refetch: () => void
}

interface ITypeStyleInfo {
  headerSx: SxProps<Theme>
  contentSx?: SxProps<Theme>
  kioskInfoIcon: string
  kioskMainIcon: string
  kioskSettingIcon: string
}

const MonitoringCard: FC<IMonitoringCard> = ({ kioskData, refetch }): React.ReactElement => {
  const theme = useTheme()

  const [styleInfo, setStyleInfo] = useState<ITypeStyleInfo>()

  useEffect(() => {
    setStyleInfo(cardHeaderSxFn(kioskData.status, theme))
  }, [kioskData.status, theme])

  // console.log(kioskData)

  return (
    <Card sx={{ width: '291px', height: '100%' }}>
      <KioskCardHeader kioskData={kioskData} styleInfo={styleInfo} refetch={refetch} />

      <CardContent sx={{ ...styleInfo?.contentSx }}>
        <CardContentWrapper>
          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle2' fontWeight='bold' fontSize={16}>
              <Typography component='span' variant='body1' fontWeight='bold' fontSize={16}>
                설치위치:{' '}
              </Typography>
              {kioskData.kioskLocation}
            </Typography>
          </Box>

          {kioskData.remote && (
            <MonitoringContentCard
              id={kioskData.remote.id}
              type={kioskData.remote.status}
              desc={kioskData.remote.desc}
              name={kioskData.remote.name}
              relayIp={kioskData.relayIp}
            />
          )}

          {kioskData.modules.map(item => (
            <MonitoringContentCard
              key={item.id}
              id={item.id}
              type={item.status}
              desc={item.desc ?? undefined}
              name={item.name}
              items={item.items}
              useSwitch
              powerType={item.powerType}
              relayIp={kioskData.relayIp}
              port={item.port}
            />
          ))}
        </CardContentWrapper>
      </CardContent>
    </Card>
  )
}

const CardContentWrapper = styled('div')({
  paddingTop: '10px'
})

export default MonitoringCard
