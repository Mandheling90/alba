// ** MUI Imports
import MuiBox, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Hooks Imports
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'

// Styled Box component
const Box = styled(MuiBox)<BoxProps>(() => ({
  width: 20,
  height: 20,
  borderWidth: 3,
  borderRadius: '50%',
  borderStyle: 'solid'
}))

interface StepperCustomDotProps {
  active: boolean
  completed: boolean
  isValid?: boolean
}

const StepperCustomDot = (props: StepperCustomDotProps) => {
  const { active, completed, isValid } = props

  // ** Hooks
  const theme = useTheme()
  const bgColors: UseBgColorType = useBgColor()

  if (isValid || completed) {
    return <Icon icon='mdi:check-circle' fontSize={20} color={theme.palette.primary.main} transform='scale(1.3)' />
  } else {
    return (
      <Box
        sx={{
          width: 20,
          height: 20,
          borderWidth: 3,
          borderRadius: '50%',
          borderStyle: 'solid',
          color: active ? 'primary.main' : 'grey.300',
          borderColor: bgColors.primaryLight.backgroundColor,
          ...(active && {
            borderWidth: 5,
            borderColor: 'primary.main',
            backgroundColor: theme.palette.mode === 'light' ? 'common.white' : 'background.default'
          })
        }}
      />
    )
  }
}

export default StepperCustomDot
