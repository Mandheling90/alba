import { Box, Switch, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CustomTextFieldState from 'src/@core/components/atom/CustomTextFieldState'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import LatLonInput from 'src/@core/components/atom/LatLonInput'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import { EMenuType, YN } from 'src/enum/commonEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import { MClientCameraList } from 'src/model/cameras/CamerasModel'
import { IAiSolutionService } from 'src/model/client/clientModel'
import { MUserInfo } from 'src/model/commonModel'
import { getAuthMenu } from 'src/utils/CommonUtil'
import ModifyActions from '../../../../pages/cameras/table/ModifyActions'

interface CameraColumnsProps {
  isGroupMode?: boolean
  setIsGroupMode?: (value: boolean) => void
  updateClientCameraData?: (cameraNo: number, data: Partial<MClientCameraList>) => void
  handleCancelClick?: (cameraNo?: number) => void
  handleSaveClick?: (cameraNo?: number) => void
  isGroupModifyMode?: boolean
  viewType?: { type: string }
  setMapModifyModCameraId?: (cameraNo: number | null) => void
  mapModifyModCameraId?: number | null
  clientGroupStatus?: (params: { cameraNo: number; companyNo: number; cameraStatus: YN }) => Promise<any>
  companyNo?: number
  columnFilter?: string[]
  showGroupHeader?: boolean
  userInfo?: MUserInfo
}

const createColumnDefinitions = (props: CameraColumnsProps): Record<string, GridColDef> => {
  const {
    isGroupMode,
    setIsGroupMode,
    updateClientCameraData,
    handleCancelClick,
    handleSaveClick,
    isGroupModifyMode,
    viewType,
    userInfo,
    showGroupHeader = true,
    clientGroupStatus,
    companyNo
  } = props

  const groupHeaderRenderer = () => {
    return (
      <>
        {!isGroupModifyMode ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SwitchCustom
              width={50}
              switchName={['개별', '그룹']}
              selected={!isGroupMode}
              onChange={() => setIsGroupMode?.(!isGroupMode)}
              activeColor={['#9155FD', '#9155FD']}
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              sx={{
                height: '10px',
                border: '1px solid',
                borderRadius: '5px',
                padding: '12px 10px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              개별
            </Box>
          </Box>
        )}
      </>
    )
  }

  return {
    group: {
      field: 'group',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideable: true,
      flex: 0.2,
      sortable: false,
      align: 'center',
      type: 'string',
      headerName: '전체',
      ...(showGroupHeader ? { renderHeader: groupHeaderRenderer } : {}),
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconCustom
              isCommon
              path='camera'
              style={{ width: '25px', height: '25px' }}
              icon={
                row.flowPlanBindingYN === YN.Y
                  ? viewType?.type === 'image'
                    ? 'image-mode'
                    : 'image-mode-disable'
                  : viewType?.type === 'map'
                  ? 'map-mode-full'
                  : 'map-mode-full-disable'
              }
            />
          </Box>
        )
      }
    },
    cameraId: {
      field: 'cameraId',
      headerName: '카메라ID',
      headerAlign: 'center',
      flex: 0.3,
      align: 'center',
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <>
            <Typography component='span' variant='inherit'>
              {row.cameraId}
            </Typography>
          </>
        )
      }
    },
    cameraName: {
      field: 'cameraName',
      headerName: '카메라명',
      headerAlign: 'center',
      flex: 0.3,
      align: 'center',
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <>
            {row.isEdit ? (
              <CustomTextFieldState
                size='small'
                value={row.cameraName}
                onChange={e => {
                  updateClientCameraData?.(row.cameraNo, { cameraName: e.target.value })
                }}
                onKeyDown={e => {
                  if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.stopPropagation()
                  }
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
    serviceTypes: {
      field: 'serviceTypes',
      headerName: '서비스명',
      headerAlign: 'center',
      align: 'center',
      flex: 0.3,
      type: 'string',
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
    zonePoints: {
      field: 'zonePoints',
      headerName: '카메라 위치',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        const isEditing = row.isEdit ?? false

        const x = row.flowPlanBindingYN === YN.Y ? row.flowPlanX ?? 0 : row.lat ?? 0
        const y = row.flowPlanBindingYN === YN.Y ? row.flowPlanY ?? 0 : row.lon ?? 0

        return (
          <LatLonInput
            cameraNo={row.cameraNo}
            lat={x}
            lon={y}
            isEditing={isEditing}
            onLatChange={value => {
              viewType?.type === 'image' &&
                updateClientCameraData?.(row.cameraNo, {
                  lat: value ?? 0,
                  lon: y
                })
            }}
            onLonChange={value => {
              viewType?.type === 'image' &&
                updateClientCameraData?.(row.cameraNo, {
                  lat: x,
                  lon: value ?? 0
                })
            }}
          />
        )
      }
    },
    cameraStatus: {
      field: 'cameraStatus',
      headerName: '사용여부',
      headerAlign: 'center',
      flex: 0.2,
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Switch
              disabled={getAuthMenu(userInfo?.authMenuList ?? [], EMenuType['카메라위치등록'])?.updateYn === YN.N}
              checked={row.cameraStatus === YN.Y}
              onChange={async event => {
                try {
                  const newStatus = event.target.checked ? YN.Y : YN.N
                  await clientGroupStatus?.({
                    cameraNo: row.cameraNo,
                    companyNo: companyNo ?? 0,
                    cameraStatus: newStatus
                  })
                  updateClientCameraData?.(row.cameraNo, { cameraStatus: newStatus })
                } catch (error) {
                  console.error('카메라 상태 변경 중 오류 발생:', error)
                  updateClientCameraData?.(row.cameraNo, { cameraStatus: row.cameraStatus })
                }
              }}
            />
          </Box>
        )
      }
    },
    modify: {
      field: 'modify',
      headerName: '편집',
      headerAlign: 'center',
      flex: 0.2,
      type: 'string',
      renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
        return (
          <>
            {getAuthMenu(userInfo?.authMenuList ?? [], EMenuType['카메라위치등록'])?.updateYn === YN.Y && (
              <ModifyActions
                row={row}
                isModify={row.isEdit ?? false}
                isGroupModifyMode={isGroupModifyMode ?? false}
                handleEditClick={() => {
                  updateClientCameraData?.(row.cameraNo, { isEdit: true })
                }}
                handleCancelClick={() => {
                  handleCancelClick?.(row.cameraNo)
                  updateClientCameraData?.(row.cameraNo, { isEdit: false })
                }}
                handleSaveClick={() => {
                  handleSaveClick?.(row.cameraNo)
                  updateClientCameraData?.(row.cameraNo, { isEdit: false })
                }}
              />
            )}
          </>
        )
      }
    }
  }
}

export const getCameraColumns = (props: CameraColumnsProps): GridColDef[] => {
  const { columnFilter } = props
  const columnDefinitions = createColumnDefinitions(props)

  if (columnFilter && columnFilter.length > 0) {
    return columnFilter.map(field => columnDefinitions[field as keyof typeof columnDefinitions])
  }

  return Object.values(columnDefinitions)
}
