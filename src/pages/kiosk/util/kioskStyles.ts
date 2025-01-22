import { grey, orange } from '@mui/material/colors'
import { SxProps, Theme } from '@mui/material/styles'
import { KIOSK_STATUS } from 'src/enum/kisokEnum'

interface ITypeStyleInfo {
  headerSx: SxProps<Theme>
  contentSx?: SxProps<Theme>
  kioskInfoIcon: string
  kioskMainIcon: string
  kioskSettingIcon: string
}

export const cardHeaderSxFn = (type: KIOSK_STATUS, theme: Theme): ITypeStyleInfo => {
  const baseStyles = {
    headerSx: {
      '& .MuiCardHeader-title': {
        color: theme.palette.text.primary
      }
    },
    kioskInfoIcon: 'KioskInfoPurpleDefault',
    kioskMainIcon: 'KioskMainPurpleDefault',
    kioskSettingIcon: 'KioskSettingPurpleDefault'
  }

  switch (type) {
    case KIOSK_STATUS.DISABLED:
      return {
        ...baseStyles,
        headerSx: {
          ...baseStyles.headerSx,
          background: grey[200]
        },
        contentSx: {
          background: grey[200],
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: grey[400]
          },
          '& .MuiDataGrid-row': {
            backgroundColor: grey[300],
            '&:hover': {
              backgroundColor: grey[200]
            }
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: grey[300]
          }

          //MuiDataGrid-virtualScroller css-axafay-MuiDataGrid-virtualScroller
        }
      }
    case KIOSK_STATUS.ENABLED:
      return {
        ...baseStyles,
        headerSx: {
          ...baseStyles.headerSx,
          background: theme.palette.customColors.lightPurple
        }
      }
    case KIOSK_STATUS.ERROR:
      return {
        ...baseStyles,
        headerSx: {
          ...baseStyles.headerSx,
          background: orange[100],
          '& .MuiCardHeader-title': {
            color: orange[900]
          }
        },
        contentSx: {
          background: orange[100],
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: orange[300]
          },
          '& .MuiDataGrid-row': {
            backgroundColor: orange[200],

            '&:hover': {
              backgroundColor: orange[100]
            }
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: orange[200]
          },
          '& .highcharts-background': {
            backgroundColor: orange[200]
          }
        }
      }
    default:
      return {
        headerSx: {
          background: theme.palette.primary.main,
          '& .MuiCardHeader-title': {
            color: theme.palette.common.white
          }
        },
        kioskInfoIcon: 'KioskInfoWhiteDefault',
        kioskMainIcon: 'KioskMainWhiteDefault',
        kioskSettingIcon: 'KioskSettingWhiteDefault'
      }
  }
}

export default cardHeaderSxFn
