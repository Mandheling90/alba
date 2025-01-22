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

          background: 'rgba(255, 223, 219, 1)',

          '& .MuiCardHeader-title': {
            color: orange[900]
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

export interface IContentsTypeStyle {
  contentSx?: SxProps<Theme>
  fontSx?: SxProps<Theme>
  typeMsg?: string
}

export const cardSxFn = (type: KIOSK_STATUS): IContentsTypeStyle => {
  switch (type) {
    case KIOSK_STATUS.DISABLED:
      return {
        contentSx: {
          background: 'rgba(186, 183, 183, 0.15)'
        },
        fontSx: {
          color: 'rgba(58, 53, 65, 0.6)'
        },
        typeMsg: '알수없음'
      }
    case KIOSK_STATUS.ENABLED:
      return {
        contentSx: {
          background: 'rgba(221, 208, 247, 0.4)'
        },
        fontSx: {
          color: 'rgba(9, 125, 28, 1)'
        },
        typeMsg: '정상'
      }
    case KIOSK_STATUS.ERROR:
      return {
        contentSx: {
          background: 'rgba(255, 223, 219, 1)'
        },
        fontSx: {
          color: 'rgba(255, 14, 14, 1)'
        },
        typeMsg: '오류'
      }
    default:
      return {
        contentSx: {
          background: 'rgba(186, 183, 183, 0.15)'
        }
      }
  }
}

export default cardHeaderSxFn
