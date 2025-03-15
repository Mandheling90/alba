import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useEffect, useState } from 'react'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import PageHeader from 'src/@core/components/page-header'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useCameras } from 'src/hooks/useCameras'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICameraClient, ICameraClientDetail } from 'src/model/cameras/CamerasModel'
import { useCameraClientDetailList } from 'src/service/cameras/camerasService'
import CamerasMap from './map/CamerasMap'

interface IClientDetail {
  selectClient: ICameraClient | null
}
const CamerasDetail: FC<IClientDetail> = ({ selectClient }) => {
  const cameraContext = useCameras()
  const { data: clientDetailData, refetch: clientDetailRefetch } = useCameraClientDetailList(
    cameraContext.clientCameraDetailListReq
  )
  const [selectCamera, setSelectCamera] = useState<ICameraClientDetail | null>(null)

  const clientDetailColumns: GridColDef[] = [
    {
      field: 'cameraLabel',
      headerName: '카메라명',
      headerAlign: 'center',
      flex: 1,
      renderHeader() {
        return <></>
      },
      renderCell: ({ row }: GridRenderCellParams<ICameraClientDetail>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap sx={{ ml: 2 }}>
              {row.cameraLabel}
            </Typography>
          </Box>
        )
      }
    }
  ]

  const handleSelectClientGrid = (row: ICameraClientDetail) => {
    setSelectCamera(row)
  }

  useEffect(() => {
    cameraContext.setClientCameraDetailListReq({
      ...cameraContext.clientCameraDetailListReq,
      clientId: selectClient?.clientId ?? ''
    })
  }, [selectClient])

  const [isHovered, setIsHovered] = useState(false)

  return (
    <Grid container>
      <Grid item xs={12}>
        <PageHeader
          title={
            <Typography variant='h5' sx={{ fontSize: 24, fontWeight: 500, mb: 5 }}>
              시스템 사용자 목록
            </Typography>
          }
        />
        <Grid item sx={{ height: '50vh', overflowY: 'auto', width: '100%' }}>
          <Card>
            <Box sx={{ display: 'flex' }}>
              <LayoutControlPanel
                menuName='사용자'
                id={selectClient?.clientId}
                selectedTarget={selectClient?.clientNm}
                onClick={() => {
                  cameraContext.setLayoutDisplay(!cameraContext.layoutDisplay)
                }}
              />

              <Box
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{ height: '40px' }}
              >
                <Button
                  sx={{ height: '40px', width: '150px' }}
                  variant={'contained'}
                  startIcon={<IconCustom path='cameras' icon='camera-add-remove-icon' />}
                  onClick={() => {
                    // setIsOpen(true)
                  }}
                >
                  등록 및 수정
                </Button>
              </Box>
            </Box>
            <Box sx={{ maxHeight: '30vh', overflow: 'auto' }}>
              <CustomTable
                showMoreButton={false}
                rows={clientDetailData?.data ?? []}
                columns={clientDetailColumns}
                selectRowEvent={handleSelectClientGrid}
                isAllView
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ maxHeight: '50vh', overflow: 'auto', width: '100%' }}>
        <Card>
          <CamerasMap height='50vh' />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CamerasDetail
