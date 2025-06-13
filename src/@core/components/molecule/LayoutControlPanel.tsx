import styled from '@emotion/styled'
import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'
import { AuthType } from 'src/model/commonModel'

const StyledBox = styled(Box)<{ isLast?: boolean }>`
  border: 1px solid #bbbabd;
  border-left: 0px solid;
  border-right: 0px solid;
  ${props =>
    props.isLast
      ? `
    border-radius: 0px 8px 8px 0px;
    border-right: 1px solid #bbbabd;
  `
      : ''}
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 0px 15px;
`

interface ILayoutControlPanel {
  menuName?: string
  companyId?: string
  companyName?: string
  title?: string
  onClick?: () => void
}

const LayoutControlPanel: React.FC<ILayoutControlPanel> = ({
  menuName = '고객사',
  companyId = 'DAINS',
  companyName = '다인스',
  title,
  onClick
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const layoutContext = useLayout()

  return (
    <Box>
      <AppBar position='static' sx={{ backgroundColor: 'transparent' }} elevation={0}>
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
            onClick={() => {
              if (layoutContext.layoutUserInfo?.userInfo?.authId === AuthType.ADMIN) {
                onClick?.()
              }
            }}
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
          <StyledBox>
            <Typography variant='body1'>{companyId}</Typography>
          </StyledBox>

          <StyledBox isLast={!title}>
            <Typography variant='body1'>{companyName}</Typography>
          </StyledBox>

          {title && (
            <StyledBox isLast={true}>
              <Typography variant='body1' fontWeight={800}>
                {title}
              </Typography>
            </StyledBox>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default LayoutControlPanel
