// ** MUI Imports

import { Box, Grid, IconButton, Typography } from '@mui/material'
import { FC } from 'react'
import PageHeader from 'src/@core/components/page-header'
import IconCustom from 'src/layouts/components/IconCustom'

const StandardTemplate: FC<{
  title: string
  children: React.ReactNode
  useBackButton?: boolean
  onBackButtonClick?: () => void
  rightButtonList?: React.ReactNode
}> = ({ title, children, useBackButton, onBackButtonClick, rightButtonList }) => {
  return (
    <Grid spacing={2} container>
      <Grid
        item
        xs={12}
        sx={{
          transition: theme =>
            theme.transitions.create('all', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            })
        }}
      >
        <Grid item xs={12} sx={{ mt: 5, mb: 10 }}>
          <PageHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography
                  variant='h4'
                  sx={{
                    fontWeight: 500,
                    ml: 1,
                    lineHeight: '32px',
                    fontSize: '33px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  {useBackButton && (
                    <IconButton onClick={onBackButtonClick}>
                      <IconCustom isCommon icon='arrow_left3' />
                    </IconButton>
                  )}
                  {title}
                </Typography>

                {rightButtonList && <Box>{rightButtonList}</Box>}
              </Box>
            }
          />
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default StandardTemplate
