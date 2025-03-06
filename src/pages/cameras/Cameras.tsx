import { Box, Card, Grid, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PageHeader from 'src/@core/components/page-header'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useCameras } from 'src/hooks/useCameras'
import { MCameraClient } from 'src/model/cameras/CamerasModel'
import { useCameraClientList } from 'src/service/cameras/camerasService'

const Cameras: FC = (): React.ReactElement => {
  const contents = useCameras()
  const { data: clientData, refetch: clientRefetch } = useCameraClientList(contents.contentListReqPram)
  const [selectClient, setSelectClient] = useState('')

  const columns: GridColDef[] = [
    {
      field: 'clientId',
      headerName: '고객사ID',
      headerAlign: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MCameraClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.clientId}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'clientNm',
      headerName: '고객사명',
      headerAlign: 'center',
      flex: 1,
      renderCell: ({ row }: GridRenderCellParams<MCameraClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='inherit' noWrap>
              {row.clientNm}
            </Typography>
          </Box>
        )
      }
    }
  ]
  const handleSelectClientGrid = (row: MCameraClient) => {
    setSelectClient(row.clientId)
  }

  return (
    <StandardTemplate title={'카메라 관리'}>
      <Grid container spacing={2}>
        <Grid item xs={2.5} sx={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          {/* <CameraClientListGrid
            data={clientData?.data ?? []}
            refetch={() => {
              clientRefetch()
            }}
          /> */}
          <Card>
            <CustomTable
              showMoreButton={false}
              rows={clientData?.data ?? []}
              columns={columns}
              selectRowEvent={handleSelectClientGrid}
            />
          </Card>
        </Grid>
        <Grid item xs={9.5}>
          <Grid container>
            <Grid item xs={12}>
              <PageHeader
                title={
                  <Typography variant='h5' sx={{ fontSize: 24, fontWeight: 500 }}>
                    고객사 카메라 목록
                  </Typography>
                }
              />
              <Grid item xs={12} sx={{ height: '50vh', overflowY: 'auto' }}>
                {selectClient}
              </Grid>
              <Grid item xs={12} sx={{ height: '50vh', overflowY: 'auto' }}>
                Grid 2
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}
export default Cameras
