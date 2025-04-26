import { Box, Button, Card, Grid, Switch, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import ButtonHover from 'src/@core/components/atom/ButtonHover'
import CustomTextFieldState from 'src/@core/components/atom/CustomTextFieldState'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import LatLonInput from 'src/@core/components/atom/LatLonInput'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import CustomTable from 'src/@core/components/table/CustomTable'
import { YN } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useCameras } from 'src/hooks/useCameras'
import { useLayout } from 'src/hooks/useLayout'
import IconCustom from 'src/layouts/components/IconCustom'
import { MClientCameraList, MClientGroupCameraList } from 'src/model/cameras/CamerasModel'
import { IAiSolutionService } from 'src/model/client/clientModel'
import { useClientGroupAdd, useClientGroupStatus } from 'src/service/cameras/camerasService'
import styled from 'styled-components'
import CameraModifyActions from './CameraModifyActions'
import GroupList from './GroupList'

const ButtonHoverIconList = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CamerasClientList: FC = () => {
  const {
    clientCameraData,
    setClientCameraData,
    clientGroupCameraData,
    setClientGroupCameraData,
    groupModifyId,
    setGroupModifyId,
    isGroupModifyMode,
    setIsGroupModifyMode,
    updateClientCameraData,
    handleSaveClick,
    handleCancelClick,
    setSelectedCamera,
    mapModifyModCameraId,
    setMapModifyModCameraId,
    viewType,
    clientCameraDataOrigin,
    fetchData,
    removeDuplicateCameras,
    handleGroupSaveClick,
    addGroupCamera,
    handleGroupCancelClick
  } = useCameras()

  const { companyNo, companyId, companyName } = useLayout()
  const { user } = useAuth()

  const layoutContext = useLayout()
  const [draggedRow, setDraggedRow] = useState<MClientCameraList | null>(null)
  const [isGroupMode, setIsGroupMode] = useState<boolean>(false)

  const { mutateAsync: clientGroupAdd } = useClientGroupAdd()
  const { mutateAsync: clientGroupStatus } = useClientGroupStatus()
  const router = useRouter()

  //GroupModifyId

  useEffect(() => {
    fetchData()
  }, [companyNo])

  const clientColumns: GridColDef[] = [
    {
      field: 'group',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: true,
      flex: 0.2,
      sortable: false,
      align: 'center',
      renderHeader: () => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SwitchCustom
              width={50}
              switchName={['개별', '그룹']}
              selected={!isGroupMode}
              onChange={() => setIsGroupMode(!isGroupMode)}
              activeColor={['#9155FD', '#9155FD']}
            />
          </Box>
        )
      },
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCustom
              isCommon
              path='camera'
              style={{ width: '30px', height: '30px' }}
              icon={row.flowPlanBindingYN === YN.Y ? 'image-mode' : 'map-mode-full'}
            />
          </Box>
        )
      }
    },
    {
      field: 'cameraId',
      headerName: '카메라ID',
      headerAlign: 'center',
      flex: 0.3,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <>
            {row.isEdit ? (
              <CustomTextFieldState
                size='small'
                value={row.cameraId}
                onChange={e => {
                  updateClientCameraData(row.cameraNo, { cameraId: e.target.value })
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
      flex: 0.3,
      align: 'center',
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <>
            {row.isEdit ? (
              <CustomTextFieldState
                size='small'
                value={row.cameraName}
                onChange={e => {
                  updateClientCameraData(row.cameraNo, { cameraName: e.target.value })
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
      flex: 0.3,
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {row.aiSolutionServiceResDtoList.map((serviceType: IAiSolutionService, index: number) =>
              row.aiSolutionServiceResDtoList.length <= 1 ? (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconCustom isCommon path='clients' icon={serviceType.iconName} />
                  <Typography component='span' variant='inherit' noWrap>
                    {serviceType.aiServiceName}
                  </Typography>
                </Box>
              ) : (
                <CustomTooltip title={serviceType.aiServiceName} key={index} placement='top'>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconCustom isCommon path='clients' icon={serviceType.iconName} />
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
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        const isEditing = row.isEdit ?? false

        const x = row.flowPlanBindingYN === YN.Y ? row.flowPlanX ?? 0 : row.lat ?? 0
        const y = row.flowPlanBindingYN === YN.Y ? row.flowPlanY ?? 0 : row.lon ?? 0

        return (
          <LatLonInput
            lat={x}
            lon={y}
            isEditing={isEditing}
            onLatChange={value => {
              viewType.type === 'image' &&
                updateClientCameraData(row.cameraNo, {
                  lat: value ?? 0,
                  lon: y
                })
            }}
            onLonChange={value => {
              viewType.type === 'image' &&
                updateClientCameraData(row.cameraNo, {
                  lat: x,
                  lon: value ?? 0
                })
            }}
            onMapClick={() => {
              viewType.type === 'image' && setMapModifyModCameraId(row.cameraNo)
            }}
            isMapActive={mapModifyModCameraId === row.cameraNo}
          />
        )
      }
    },
    {
      field: 'cameraStatus',
      headerName: '사용여부',
      headerAlign: 'center',
      flex: 0.2,
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Switch
              checked={row.cameraStatus === YN.Y}
              onChange={async event => {
                await clientGroupStatus({
                  cameraNo: row.cameraNo,
                  companyNo: companyNo,
                  cameraStatus: event.target.checked ? YN.Y : YN.N
                })
                updateClientCameraData(row.cameraNo, { cameraStatus: event.target.checked ? YN.Y : YN.N })
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
      flex: 0.2,
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <CameraModifyActions
            row={row}
            isModify={row.isEdit ?? false}
            isGroupModifyMode={isGroupModifyMode}
            handleEditClick={() => {
              updateClientCameraData(row.cameraNo, { isEdit: true })
            }}
            handleCancelClick={() => {
              handleCancelClick(row.cameraNo)
              updateClientCameraData(row.cameraNo, { isEdit: false })
            }}
            handleSaveClick={() => {
              handleSaveClick(row.cameraNo)
              updateClientCameraData(row.cameraNo, { isEdit: false })
            }}
          />
        )
      }
    }
  ]

  const handleDragStart = (row: MClientCameraList) => {
    setDraggedRow(row)
  }

  const handleDragEnd = () => {
    setDraggedRow(null)
  }

  const handleDrop = () => {
    if (draggedRow && clientCameraData && groupModifyId) {
      addGroupCamera(groupModifyId, draggedRow)

      // handleGroupCameraItemAdd(groupModifyId, draggedRow.cameraNo)
    }
  }

  const selectRowEvent = (row: MClientCameraList) => {
    if (viewType.type === 'image' && row.flowPlanBindingYN === YN.N) {
      return
    }

    if (Object.keys(row).length === 0) {
      setSelectedCamera(null)
    } else {
      setSelectedCamera([row])
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3, gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <LayoutControlPanel
                menuName='고객사'
                companyId={companyId}
                companyName={companyName}
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
                    onClick={() => {
                      router.push({
                        pathname: '/clients/clientsAdd',
                        query: {
                          mode: 'edit',
                          id: companyNo
                        }
                      })
                    }}
                  >
                    <ButtonHoverIconList

                    // onClick={() => {
                    //   console.log('add')
                    // }}
                    >
                      <IconCustom isCommon path='camera' icon='cameraAdd' />
                    </ButtonHoverIconList>
                    <ButtonHoverIconList

                    // onClick={() => {
                    //   console.log('del')
                    // }}
                    >
                      <IconCustom isCommon path='camera' icon='cameraDel' />
                    </ButtonHoverIconList>
                    <ButtonHoverIconList

                    // onClick={() => {
                    //   console.log('mod')
                    // }}
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
                      if (!clientGroupCameraData) return

                      try {
                        // const res = await clientGroupAdd({ userNo: user?.userInfo?.userNo ?? 0, name: '새로운 그룹' })
                        // console.log(res.data.groupId)

                        // 새로운 그룹 ID 생성 (기존 그룹 ID 중 최대값 + 1)
                        const newGroupId = clientGroupCameraData.length + 1

                        // 새로운 그룹 생성
                        const newGroup: MClientGroupCameraList = {
                          groupId: newGroupId,
                          userNo: user?.userInfo?.userNo ?? 0,
                          groupName: '새로운 그룹',
                          groupItemList: []
                        }

                        // 그룹 데이터 업데이트
                        setClientGroupCameraData(prevData => {
                          if (!prevData) return [newGroup]

                          return [...prevData, newGroup]
                        })

                        // 그룹 수정 모드 활성화
                        setGroupModifyId(newGroupId)
                        setIsGroupModifyMode(true)
                      } catch (error) {
                        console.log(error)
                      }
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
                  if (!isGroupMode) {
                    handleSaveClick(undefined)
                  } else {
                    handleGroupSaveClick(undefined)
                  }
                }}
              >
                저장
              </Button>
              <Button
                variant={'outlined'}
                onClick={() => {
                  setSelectedCamera(null)

                  if (!isGroupMode) {
                    handleCancelClick(undefined)
                  } else {
                    handleGroupCancelClick(undefined)
                  }
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
            rows={isGroupModifyMode ? removeDuplicateCameras() : clientCameraData ?? []}
            columns={clientColumns}
            selectRowEvent={selectRowEvent}
            isAllView
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            enablePointer
            showHeader
            hideRows={isGroupModifyMode ? false : isGroupMode}
          />

          {isGroupMode &&
            clientGroupCameraData?.map((group, index) => (
              <>
                <GroupList
                  key={index}
                  group={group}
                  clientColumns={clientColumns}
                  handleClose={() => {
                    setIsGroupModifyMode(false)
                    setClientCameraData(clientCameraDataOrigin ?? [])
                    setGroupModifyId(null)
                  }}
                  handleGroupModifyId={() => {
                    setIsGroupModifyMode(true)
                    setGroupModifyId(group.groupId)
                  }}
                  onDrop={() => handleDrop()}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  selectRowEvent={selectRowEvent}
                />
              </>
            ))}
        </Card>
      </Grid>
    </Grid>
  )
}

export default CamerasClientList
