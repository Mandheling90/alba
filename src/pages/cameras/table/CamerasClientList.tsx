import { Box, Button, Card, Grid, IconButton, Switch, TextField, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useEffect } from 'react'
import ButtonHover from 'src/@core/components/atom/ButtonHover'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import DividerBar from 'src/@core/components/atom/DividerBar'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import CustomTable from 'src/@core/components/table/CustomTable'
import PipeLine from 'src/@core/components/table/PipeLine'
import { useCameras } from 'src/hooks/useCameras'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'
import { ICameraClient, MCameraList } from 'src/model/cameras/CamerasModel'
import { SERVICE_TYPE, SERVICE_TYPE_LABELS } from 'src/model/client/clientModel'
import { useClientCameraList } from 'src/service/cameras/camerasService'
import styled from 'styled-components'
import CameraModifyActions from './CameraModifyActions'
import GroupList from './GroupList'

interface IClientList {
  handleSelectClientGrid: (row: ICameraClient) => void
}

const ButtonHoverIconList = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CamerasClientList: FC<IClientList> = ({ handleSelectClientGrid }) => {
  const cameraContext = useCameras()
  const {
    clientListReq,
    clientCameraData,
    setClientCameraData,
    setGroupAddMod,
    cameraGroupLinkDisplay,
    setCameraGroupLinkDisplay,
    updateClientCameraData,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    tempClientCameraData
  } = cameraContext
  const layoutContext = useLayout()

  const { data, refetch } = useClientCameraList(clientListReq)

  useEffect(() => {
    setClientCameraData(data?.data || null)
  }, [data?.data])

  const clientColumns: GridColDef[] = [
    {
      field: 'group',
      headerName: '그룹',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: true,
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MCameraList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCustom isCommon path='camera' icon='group-off' />
          </Box>
        )
      }
    },
    {
      field: 'cameraId',
      headerName: '카메라ID',
      headerAlign: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MCameraList>) => {
        return (
          <>
            {tempClientCameraData?.cameraList?.some(camera => camera.id === row.id) ? (
              <TextField
                size='small'
                value={row.cameraId}
                onChange={e => {
                  updateClientCameraData(row.id, { cameraId: e.target.value })
                }}
              />
            ) : (
              <Typography component='span' variant='inherit'>
                {row.cameraId}
              </Typography>
            )}
          </>
        )
      }
    },
    {
      field: 'cameraName',
      headerName: '카메라명',
      headerAlign: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MCameraList>) => {
        return (
          <>
            {tempClientCameraData?.cameraList?.some(camera => camera.id === row.id) ? (
              <TextField
                size='small'
                value={row.cameraName}
                onChange={e => {
                  updateClientCameraData(row.id, { cameraName: e.target.value })
                }}
              />
            ) : (
              <Typography component='span' variant='inherit'>
                {row.cameraName}
              </Typography>
            )}
          </>
        )
      }
    },
    {
      field: 'serviceTypes',
      headerName: '서비스명',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      renderCell: ({ row }: GridRenderCellParams<MCameraList>) => {
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
      renderCell: ({ row }: GridRenderCellParams<MCameraList>) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%'
            }}
          >
            {tempClientCameraData?.cameraList?.some(camera => camera.id === row.id) ? (
              <>
                <TextField
                  size='small'
                  value={row.zonePoints.lat}
                  onChange={e => {
                    updateClientCameraData(row.id, {
                      zonePoints: { ...row.zonePoints, lat: parseFloat(e.target.value) }
                    })
                  }}
                />
                <IconButton
                  sx={{ color: 'text.secondary' }}
                  onClick={() => {
                    // setCameraModifyId(row.id)
                  }}
                >
                  <IconCustom isCommon path='camera' icon='map-point' />
                </IconButton>
                <TextField
                  size='small'
                  value={row.zonePoints.lon}
                  onChange={e => {
                    updateClientCameraData(row.id, {
                      zonePoints: { ...row.zonePoints, lon: parseFloat(e.target.value) }
                    })
                  }}
                />
              </>
            ) : (
              <>
                <Typography component='span' variant='inherit'>
                  {row.zonePoints.lat !== null ? `${row.zonePoints.lat.toFixed(5)}` : 'N/A'}
                </Typography>

                <PipeLine />

                <Typography component='span' variant='inherit'>
                  {row.zonePoints.lon !== null ? ` ${row.zonePoints.lon.toFixed(5)}` : 'N/A'}
                </Typography>
              </>
            )}
          </Box>
        )
      }
    },
    {
      field: 'isUse',
      headerName: '사용여부',
      headerAlign: 'center',
      flex: 0.4,
      renderCell: ({ row }: GridRenderCellParams<MCameraList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Switch
              checked={row.isUse}
              onChange={event => {
                updateClientCameraData(row.id, { isUse: event.target.checked })
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
      renderCell: ({ row }: GridRenderCellParams<MCameraList>) => {
        return (
          <CameraModifyActions
            row={row}
            isModify={tempClientCameraData?.cameraList?.some(camera => camera.id === row.id) ?? false}
            cameraGroupLinkDisplay={cameraGroupLinkDisplay}
            handleEditClick={handleEditClick}
            handleCancelClick={handleCancelClick}
            handleSaveClick={handleSaveClick}
          />
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

              <ButtonHover
                display={
                  <Button variant={'contained'} startIcon={<IconCustom isCommon path='camera' icon='group-add' />}>
                    그룹생성
                  </Button>
                }
                hover={
                  <Button
                    variant={'contained'}
                    startIcon={<IconCustom isCommon path='camera' icon='group-open-blank' />}
                    onClick={async () => {
                      setCameraGroupLinkDisplay(true)
                      setGroupAddMod(true)
                    }}
                  >
                    그룹생성
                  </Button>
                }
              />
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
            combineTableId={'camera'}
            id='cameraId'
            showMoreButton={false}
            rows={clientCameraData?.cameraList ?? []}
            columns={clientColumns}
            selectRowEvent={handleSelectClientGrid}
            isAllView
          />

          <DividerBar />
          {data?.data?.groupList.map((group, index) => (
            <GroupList
              key={index}
              group={group}
              clientColumns={clientColumns}
              isAddOpen={true}
              isModify={false}
              handleClose={() => {
                setCameraGroupLinkDisplay(false)
              }}
              handleGroupModifyId={() => {
                setCameraGroupLinkDisplay(true)
              }}
            />
          ))}
        </Card>
      </Grid>
    </Grid>
  )
}

export default CamerasClientList
