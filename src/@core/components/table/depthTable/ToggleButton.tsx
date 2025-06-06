import { Box, useMediaQuery, useTheme } from '@mui/material'
import IconCustom from 'src/layouts/components/IconCustom'

interface ToggleButtonProps {
  depth: number
  isExpanded: boolean
  onToggle: (e: React.MouseEvent) => void
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ depth, isExpanded, onToggle }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // 600px 미만
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')) // 600px ~ 900px
  const isDesktop = useMediaQuery(theme.breakpoints.between('md', 'lg')) // 900px ~ 1200px
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg')) // 1200px 이상

  const getLeftPosition = () => {
    if (depth === 2) return 0
    if (isMobile) return 0
    if (isTablet) return 5
    if (isDesktop) return 5
    if (isLargeDesktop) return 20

    return 20 // 기본값
  }

  return (
    <Box sx={{ width: '100%', position: 'relative' }} display='flex' alignItems='center'>
      <Box sx={{ position: 'absolute', left: getLeftPosition() }}>
        <IconCustom
          isCommon
          path='table'
          style={{ cursor: 'pointer' }}
          onClick={onToggle}
          icon={isExpanded ? 'unfolding' : 'folding'}
        />
      </Box>
    </Box>
  )
}

export default ToggleButton
