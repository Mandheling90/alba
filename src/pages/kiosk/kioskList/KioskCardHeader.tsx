// ** MUI Imports
import { Box, CardHeader, Checkbox, FormControlLabel, IconButton, Switch, Typography } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import { FC, useEffect, useState } from 'react'
import { KIOSK_STATUS } from 'src/enum/kisokEnum'
import { useKiosk } from 'src/hooks/useKiosk'
import IconCustom from 'src/layouts/components/IconCustom'
import { MKiosk } from 'src/model/kiosk/kioskModel'
import { useKioskUpdate } from 'src/service/kiosk/kioskService'

interface IKioskCardHeader {
  kioskData: MKiosk
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
  const kiosk = useKiosk()
  const [checkboxStates, setCheckboxStates] = useState(false)

  const { mutateAsync } = useKioskUpdate()

  useEffect(() => {
    if (checkboxStates) {
      kiosk.setCheckedKioskIds([...kiosk.checkedKioskIds, kioskData.id])
    } else {
      kiosk.setCheckedKioskIds(kiosk.checkedKioskIds.filter(number => number !== kioskData.id))
    }
  }, [checkboxStates])

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
            control={
              <Checkbox
                value={kioskData.id}
                onChange={() => setCheckboxStates(!checkboxStates)}
                checked={checkboxStates}
                sx={{
                  padding: '4px'
                }}
              />
            }
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
                {kioskData.name}
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
      action={
        <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
          <Switch
            checked={kioskData.kioskStatus !== KIOSK_STATUS.DISABLED}
            onChange={async event => {
              await mutateAsync({
                id: kioskData.id,
                kioskStatus: event.target.checked ? KIOSK_STATUS.ENABLED : KIOSK_STATUS.DISABLED
              })
              refetch()
            }}
          />

          <IconButton
            sx={{ display: 'inline-block' }}
            onClick={() => {
              kiosk.setSelectedKioskInfo(kioskData)
              kiosk.setIsKioskManagerModalOpen(true)
            }}
          >
            <IconCustom isCommon icon={'Edit'} />
          </IconButton>
          <IconButton
            sx={{ display: 'inline-block' }}
            onClick={async () => {
              await kiosk.kioskDelete([kioskData.id], undefined, errorCallback => {
                alert(errorCallback.message)
              })
              refetch()
            }}
          >
            <IconCustom isCommon icon={'DeleteOutline'} />
          </IconButton>
        </Box>
      }
    />
  )
}

export default KioskCardHeader
