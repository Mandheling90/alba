import { Box, Collapse, Grid, Typography } from '@mui/material'
import { FC, useContext, useEffect, useState } from 'react'
import PageHeader from 'src/@core/components/page-header'
import { CamerasContext } from 'src/context/CamerasContext'
import { ICameraClient } from 'src/model/cameras/CamerasModel'
import CamerasMap from './map/CamerasMap'
import CamerasClientList from './table/CamerasClientList'

interface IClientDetail {
  selectClient: ICameraClient | null
}
const CamerasDetail: FC<IClientDetail> = ({ selectClient }) => {
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
                고객사 카메라 목록
              </Typography>
            }
          />
          <Box sx={{ height: '35vh', overflow: 'auto' }}>
            <CamerasClientList />
          </Box>
        </Grid>
      </Collapse>

      <Grid item xs={12} style={{ height: isFullView ? '80vh' : '40vh', transition: 'height 0.3s ease' }}>
        <CamerasMap height={isFullView ? '80vh' : '40vh'} />
      </Grid>
    </Grid>
  )
}

export default CamerasDetail
