import { Box, Switch, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CustomTextFieldState from 'src/@core/components/atom/CustomTextFieldState'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import LatLonInput from 'src/@core/components/atom/LatLonInput'
import SwitchCustom from 'src/@core/components/atom/SwitchCustom'
import { YN } from 'src/enum/commonEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import { MClientCameraList } from 'src/model/cameras/CamerasModel'
import { IAiSolutionService } from 'src/model/client/clientModel'
import CameraModifyActions from '../../../../pages/cameras/table/CameraModifyActions'

interface CameraColumnsProps {
  isGroupMode?: boolean
  setIsGroupMode?: (value: boolean) => void
  updateClientCameraData?: (cameraNo: number, data: Partial<MClientCameraList>) => void
  handleCancelClick?: (cameraNo?: number) => void
  handleSaveClick?: (cameraNo?: number) => void
  isGroupModifyMode?: boolean
  viewType?: { type: string }
  setMapModifyModCameraId?: (cameraNo: number) => void
  mapModifyModCameraId?: number | null
  clientGroupStatus?: (params: { cameraNo: number; companyNo: number; cameraStatus: YN }) => Promise<any>
  companyNo?: number
  columnFilter?: string[]
  showGroupHeader?: boolean
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
    setMapModifyModCameraId,
    mapModifyModCameraId,
    clientGroupStatus,
    companyNo,
    showGroupHeader = true
  } = props

  const groupHeaderRenderer = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SwitchCustom
          width={50}
          switchName={['개별', '그룹']}
          selected={!isGroupMode}
          onChange={() => setIsGroupMode?.(!isGroupMode)}
          activeColor={['#9155FD', '#9155FD']}
        />
      </Box>
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
              style={{ width: '30px', height: '30px' }}
              icon={row.flowPlanBindingYN === YN.Y ? 'image-mode' : 'map-mode-full'}
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
            {row.isEdit ? (
              <CustomTextFieldState
                size='small'
                value={row.cameraId}
                onChange={e => {
                  updateClientCameraData?.(row.cameraNo, { cameraId: e.target.value })
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
            onMapClick={() => {
              viewType?.type === 'image' && setMapModifyModCameraId?.(row.cameraNo)
            }}
            isMapActive={mapModifyModCameraId === row.cameraNo}
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
              checked={row.cameraStatus === YN.Y}
              onChange={async event => {
                try {
                  const newStatus = event.target.checked ? YN.Y : YN.N
                  await clientGroupStatus?.({
                    cameraNo: row.cameraNo,
                    companyNo: companyNo ?? 0,
                    cameraStatus: newStatus
                  })

                  // API 호출이 성공한 후에만 상태 업데이트
                  updateClientCameraData?.(row.cameraNo, { cameraStatus: newStatus })
                } catch (error) {
                  console.error('카메라 상태 변경 중 오류 발생:', error)

                  // 에러 발생 시 스위치를 원래 상태로 되돌림
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
          <CameraModifyActions
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
