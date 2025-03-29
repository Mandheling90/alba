import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import PageHeader from 'src/@core/components/page-header'
import { useCameras } from 'src/hooks/useCameras'
import { ICameraClient } from 'src/model/cameras/CamerasModel'
import CamerasMap from './map/CamerasMap'
import CamerasClientList from './table/CamerasClientList'

interface IClientDetail {
  selectClient: ICameraClient | null
}
const CamerasDetail: FC<IClientDetail> = ({ selectClient }) => {
  const cameraContext = useCameras()

  // useEffect(() => {
  //   cameraContext.setClientCameraDetailListReq({
  //     ...cameraContext.clientCameraDetailListReq,
  //     clientId: selectClient?.clientId ?? ''
  //   })
  // }, [selectClient])

  // const [isHovered, setIsHovered] = useState(false)

  return (
    <Grid container>
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

      <Grid item xs={12}>
        <CamerasMap height='40vh' />
      </Grid>
    </Grid>
  )
}

export default CamerasDetail
