import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'

interface ILayoutControlPanel {
  menuName?: string
  id?: string
  selectedTarget?: string
  onClick?: () => void
}

const LayoutControlPanel: React.FC<ILayoutControlPanel> = ({
  menuName = '고객사',
  id = '',
  selectedTarget = '',
  onClick
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const layoutContext = useLayout()

  return (
    <Box>
      <AppBar position='static' color='inherit' elevation={0}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            minHeight: '40px',
            '@media (min-width: 600px)': {
              paddingLeft: 0,
              paddingRight: 0
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid #9155FD`,
              borderRight: `0px solid `,
              cursor: 'pointer',
              padding: '0px 15px',
              borderRadius: '8px 0px 0px 8px',
              backgroundColor: isHovered ? '#9155FD' : 'transparent',
              transition: 'all 0.3s ease'
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <IconCustom
              isCommon
              icon={
                layoutContext.layoutDisplay
                  ? isHovered
                    ? 'camera-fold-hover-icon'
                    : 'camera-fold-icon'
                  : isHovered
                  ? 'camera-open-hover-icon'
                  : 'camera-open-icon'
              }
              style={{
                width: '40px',
                height: '20px',
                transition: 'opacity 0.3s ease',
                opacity: 1
              }}
            />
          </Box>

          <Box
            sx={{
              border: `1px solid #9155FD`,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0px 15px'
            }}
          >
            <Typography variant='body1' color='white'>
              {menuName}
            </Typography>
          </Box>

          {/* NA01 섹션 */}
          <Box
            sx={{
              border: `1px solid #BBBABD`,
              borderLeft: `0px solid`,
              borderRight: '0px solid ',
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0px 15px'
            }}
          >
            <Typography variant='body1'>{id}</Typography>
          </Box>

          <Box
            sx={{
              border: `1px solid #BBBABD`,
              borderLeft: `0px solid`,
              borderRadius: '0px 8px 8px 0px',
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0px 15px'
            }}
          >
            <Typography variant='body1'>{selectedTarget}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default LayoutControlPanel
