import { Box, Collapse, Grid, Typography } from '@mui/material'
import { FC, useContext, useEffect, useState } from 'react'
import PageHeader from 'src/@core/components/page-header'
import { CamerasContext } from 'src/context/CamerasContext'
import { ICameraClient } from 'src/model/cameras/CamerasModel'
import StatTermList from '../table/StatTermList'

interface IStatTerm {
  selectClient: ICameraClient | null
}
const StatTerm: FC<IStatTerm> = ({ selectClient }) => {
  const { viewType } = useContext(CamerasContext)

  const [isFullView, setIsFullView] = useState(false)

  useEffect(() => {
    if (viewType.size === 'full') {
      setIsFullView(true)
    } else {
      setIsFullView(false)
    }
  }, [viewType.size])

  return (
    <Grid container>
      <Collapse in={!isFullView} timeout={300} style={{ width: '100%' }}>
        <Grid item xs={12}>
          <PageHeader
            title={
              <Typography variant='h5' sx={{ fontSize: 24, fontWeight: 500, mb: 5 }}>
                통계 용어 관리
              </Typography>
            }
          />
          <Box sx={{ height: '80vh', overflow: 'auto' }}>
            <StatTermList />
          </Box>
        </Grid>
      </Collapse>
    </Grid>
  )
}

export default StatTerm
