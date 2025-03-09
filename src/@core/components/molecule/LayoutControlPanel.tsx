import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'
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

  return (
    <Box>
      <AppBar position='static' color='inherit' elevation={0}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            width: '387px',
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
              backgroundColor: isHovered ? '#9155FD' : 'transparent'
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <IconCustom
              isCommon
              icon={isHovered ? 'camera-fold-hover-icon' : 'camera-fold-icon'}
              style={{
                width: '40px',
                height: '20px'
              }}
            />
          </Box>

          {/* 중간 보라색 섹션: 고객사 */}
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

          {/* 오른쪽 섹션: 국립농업박물관 */}
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
