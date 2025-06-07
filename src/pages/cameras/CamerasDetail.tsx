import { Box, Card, Collapse, Grid, Typography } from '@mui/material'
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
    <Grid container wrap='nowrap' direction={'column'} style={{ height: '100%' }}>
      <Collapse
        in={!isFullView}
        timeout={300}
        style={{ width: '100%', height: '100%' }}
        sx={{
          '& .MuiCollapse-wrapper': {
            height: '100%'
          },
          '& .MuiCollapse-wrapperInner': {
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gridTemplateColumns: '100%'
          }
        }}
      >
        <PageHeader
          title={
            <Typography variant='h5' sx={{ fontSize: 24, fontWeight: 500, mb: 5 }}>
              고객사 카메라 목록
            </Typography>
          }
        />
        <Box height={'100%'} sx={{ overflow: 'auto', borderRadius: '6px' }}>
          <Card>
            <CamerasClientList />
          </Card>
        </Box>
      </Collapse>

      <Grid item xs={12} style={{ height: isFullView ? '80vh' : '36vh', transition: 'height 0.3s ease' }}>
        {/* <CamerasMap height={isFullView ? '80vh' : '36vh'} /> */}
        <CamerasMap height={'100%'} />
      </Grid>
    </Grid>
  )
}

export default CamerasDetail
