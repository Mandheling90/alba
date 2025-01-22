// ** MUI Imports
import { Box, CardHeader, FormControlLabel, Typography } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import { FC } from 'react'
import { MMonitoringHealth } from 'src/model/monitoring/monitoringModel'

interface IKioskCardHeader {
  kioskData: MMonitoringHealth
  styleInfo?: ITypeStyleInfo
  refetch: () => void
}

interface ITypeStyleInfo {
  headerSx: SxProps<Theme>
  contentSx?: SxProps<Theme>
  kioskInfoIcon: string
  kioskMainIcon: string
  kioskSettingIcon: string
}

const KioskCardHeader: FC<IKioskCardHeader> = ({ kioskData, styleInfo, refetch }): React.ReactElement => {
  return (
    <CardHeader
      sx={{
        pb: 1,
        pt: 1,
        borderBottom: '1px solid #fff',
        ...styleInfo?.headerSx
      }}
      title={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={<></>}
            label={
              <Typography
                variant='h6'
                fontWeight={500}
                noWrap
                sx={{
                  color: 'rgba(58, 53, 65, 0.87)',
                  lineHeight: '32px',
                  fontSize: '20px',
                  maxWidth: '220px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {kioskData.kioskName}
              </Typography>
            }
            sx={{
              margin: 0,
              padding: '2px 0',
              minHeight: '32px'
            }}
          />
        </Box>
      }
      action={<></>}
    />
  )
}

export default KioskCardHeader
