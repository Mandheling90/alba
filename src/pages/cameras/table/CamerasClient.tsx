import { Box, Button, Card, Grid, IconButton, Switch, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useCallback, useState } from 'react'
import ButtonHover from 'src/@core/components/atom/ButtonHover'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useCameras } from 'src/hooks/useCameras'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICameraClient, ICameraList } from 'src/model/cameras/CamerasModel'
import { SERVICE_TYPE, SERVICE_TYPE_LABELS } from 'src/model/client/clientModel'
import { useCameraClientList } from 'src/service/cameras/camerasService'
import styled from 'styled-components'

interface IClientList {
  handleSelectClientGrid: (row: ICameraClient) => void
}

const CamerasClient: FC<IClientList> = ({ handleSelectClientGrid }) => {
  const cameraContext = useCameras()
  const layoutContext = useLayout()

  const { data, refetch } = useCameraClientList(cameraContext.clientListReq)
  const [keyword, setKeyword] = useState('')

  const handleSearch = useCallback(
    (searchKeyword: string) => {
      cameraContext.setClientListReq({ ...cameraContext.clientListReq, keyword: searchKeyword })
    },
    [cameraContext.clientListReq]
  )

  const clientColumns: GridColDef[] = [
    {
      field: 'group',
      headerName: '그룹',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: true,
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<ICameraClient>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCustom isCommon path='camera' icon='group-off' />
          </Box>
        )
      }
    },
    { field: 'cameraId', headerName: '카메라ID', headerAlign: 'center', flex: 0.5 },
    { field: 'cameraName', headerName: '카메라명', headerAlign: 'center', flex: 0.5 },
    {
      field: 'serviceTypes',
      headerName: '서비스명',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<ICameraList>) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {row.serviceTypes.map((serviceType: string, index: number) =>
              row.serviceTypes.length <= 1 ? (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconCustom isCommon path='clients' icon={serviceType} />
                  <Typography component='span' variant='inherit' noWrap>
                    {SERVICE_TYPE_LABELS[serviceType as SERVICE_TYPE]}
                  </Typography>
                </Box>
              ) : (
                <CustomTooltip title={SERVICE_TYPE_LABELS[serviceType as SERVICE_TYPE]} key={index} placement='top'>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconCustom isCommon path='clients' icon={serviceType} />
                  </Box>
                </CustomTooltip>
              )
            )}
          </Box>
        )
      }
    },
    {
      field: 'zonePoints',
      headerName: '카메라 위치',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<ICameraList>) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%'
            }}
          >
            <Typography component='span' variant='inherit'>
              {row.zonePoints.lat !== null ? `${row.zonePoints.lat.toFixed(5)}` : 'N/A'}
            </Typography>
            <Typography component='span' variant='inherit' color={'rgba(58, 53, 65, 0.42)'}>
              |
            </Typography>
            <Typography component='span' variant='inherit'>
              {row.zonePoints.lon !== null ? ` ${row.zonePoints.lon.toFixed(5)}` : 'N/A'}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'isUse',
      headerName: '사용여부',
      headerAlign: 'center',
      flex: 0.4,
      renderCell: ({ row }: GridRenderCellParams<ICameraList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Switch
              checked={row.isUse}
              onChange={event => {
                console.log(row)
              }}
            />
          </Box>
        )
      }
    },
    {
      field: 'modify',
      headerName: '편집',
      headerAlign: 'center',
      flex: 0.4,
      renderCell: ({ row }: GridRenderCellParams<ICameraList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                console.log(row)
              }}
            >
              <IconCustom isCommon path='camera' icon='mod-off' hoverIcon='mod-on' />
            </IconButton>

            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                console.log(row)
              }}
            >
              <IconCustom isCommon path='camera' icon='linkIcon-on' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3, gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <LayoutControlPanel
                menuName='사용자'
                id='user'
                selectedTarget='user'
                onClick={() => {
                  layoutContext.setLayoutDisplay(!layoutContext.layoutDisplay)
                }}
              />

              <ButtonHover
                display={
                  <Button
                    variant={'contained'}
                    sx={{ width: '160px', height: '40px' }}
                    startIcon={<IconCustom isCommon path='camera' icon='cameraAddDel' />}
                  >
                    등록 및 수정
                  </Button>
                }
                hover={
                  <Button
                    variant={'contained'}
                    sx={{ width: '160px', height: '40px', display: 'flex', justifyContent: 'space-between' }}
                  >
                    <ButtonHoverIconList
                      onClick={() => {
                        console.log('add')
                      }}
                    >
                      <IconCustom isCommon path='camera' icon='cameraAdd' />
                    </ButtonHoverIconList>
                    <ButtonHoverIconList
                      onClick={() => {
                        console.log('del')
                      }}
                    >
                      <IconCustom isCommon path='camera' icon='cameraDel' />
                    </ButtonHoverIconList>
                    <ButtonHoverIconList
                      onClick={() => {
                        console.log('mod')
                      }}
                    >
                      <IconCustom isCommon path='camera' icon='cameraMod' />
                    </ButtonHoverIconList>
                  </Button>
                }
              />

              <Button
                variant={'contained'}
                startIcon={<IconCustom isCommon path='camera' icon='group-add' />}
                onClick={async () => {
                  console.log('group')
                }}
              >
                그룹생성
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                variant={'outlined'}
                onClick={async () => {
                  console.log('group')
                }}
              >
                저장
              </Button>
              <Button
                variant={'outlined'}
                onClick={async () => {
                  console.log('group')
                }}
              >
                취소
              </Button>
            </Box>
          </Box>
          <CustomTable
            id='cameraId'
            showMoreButton={false}
            rows={data?.data || []}
            columns={clientColumns}
            selectRowEvent={handleSelectClientGrid}
            isAllView
          />
        </Card>
      </Grid>
    </Grid>
  )
}

const ButtonHoverIconList = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default CamerasClient
