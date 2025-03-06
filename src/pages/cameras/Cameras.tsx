import { AppBar, Box, Card, Grid, IconButton, TextField, Toolbar, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PageHeader from 'src/@core/components/page-header'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useCameras } from 'src/hooks/useCameras'
import IconCustom from 'src/layouts/components/IconCustom'
import { MCameraClient } from 'src/model/cameras/CamerasModel'
import { useCameraClientList } from 'src/service/cameras/camerasService'

const Cameras: FC = (): React.ReactElement => {
  const contents = useCameras()
  const { data: clientData, refetch: clientRefetch } = useCameraClientList(contents.contentListReqPram)
  const [selectClient, setSelectClient] = useState<MCameraClient | null>(null)

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
    setSelectClient(row)
  }

  return (
    <StandardTemplate title={'카메라 관리'}>
      <Grid container spacing={2}>
        <Grid item xs={2.5}>
          <TextField
            size='small'
            fullWidth
            sx={{ mb: 5 }}
            value={''}
            placeholder='고객사 ID, 고객사명'
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    console.log('search')
                  }}
                >
                  <IconCustom isCommon icon='search' />
                </IconButton>
              )
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                // contents.setContentListReqPram({ ...contents.contentListReqPram, ...reqPram })
              }
            }}
          />
        </Grid>
        <Grid item xs={9.5}>
          <PageHeader
            title={
              <Typography variant='h5' sx={{ fontSize: 24, fontWeight: 500 }}>
                고객사 카메라 목록
              </Typography>
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={2.5} sx={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
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
          <Grid item xs={12}>
            <Grid item xs={12} sx={{ height: '50vh', overflowY: 'auto' }}>
              <Card>
                <Box sx={{ ml: 5, mb: 2, mt: 4 }} color='secondary'>
                  <AppBar
                    position='static'
                    color='inherit'
                    elevation={0}
                    sx={{ border: `1px solid #9c27b0`, borderRadius: '10px', width: '387px' }}
                  >
                    <Toolbar
                      sx={{
                        alignContent: 'center',
                        justifyContent: 'center',
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
                          borderRight: '1px solid #e0e0e0',
                          alignContent: 'center',
                          justifyContent: 'center',
                          width: '70px',
                          leftPadding: '10px',
                          rightPadding: '10px'
                        }}
                      >
                        <IconCustom
                          path='cameras'
                          icon='camera-fold-icon'
                          style={{
                            width: '40px',
                            height: '20px'
                          }}
                        />
                      </Box>

                      {/* 중간 보라색 섹션: 고객사 */}
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '66px',
                          height: '40px'
                        }}
                      >
                        <Typography variant='body1' component='div' sx={{ fontWeight: 'medium', color: 'white' }}>
                          고객사
                        </Typography>
                      </Box>

                      {/* NA01 섹션 */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignContent: 'center',
                          justifyContent: 'center',
                          borderRight: '1px solid #e0e0e0',
                          width: '64px'
                        }}
                      >
                        <Typography
                          variant='body1'
                          component='div'
                          sx={{ fontWeight: 600, lineHeight: '24px', fontSize: '14px' }}
                        >
                          {selectClient?.clientId}
                        </Typography>
                      </Box>

                      {/* 오른쪽 섹션: 국립농업박물관 */}
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          alignContent: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant='body1' component='div'>
                          {selectClient?.clientNm}
                        </Typography>
                      </Box>
                    </Toolbar>
                  </AppBar>
                </Box>
              </Card>
              <Card>
                <CustomTable
                  showMoreButton={false}
                  rows={clientData?.data ?? []}
                  columns={columns}
                  selectRowEvent={handleSelectClientGrid}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sx={{ height: '50vh', overflowY: 'auto' }}>
              Grid 2
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}
export default Cameras
