import { Box, Collapse, IconButton, TextField, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useContext, useEffect, useState } from 'react'
import CustomTextFieldState from 'src/@core/components/atom/CustomTextFieldState'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import CustomTable from 'src/@core/components/table/CustomTable'
import PipeLine from 'src/@core/components/table/PipeLine'
import { CamerasContext } from 'src/context/CamerasContext'
import { TableContext } from 'src/context/TableContext'
import { YN } from 'src/enum/commonEnum'
import IconCustom from 'src/layouts/components/IconCustom'
import { MClientCameraList, MClientGroupCameraList } from 'src/model/cameras/CamerasModel'
import { useClientGroupDelete } from 'src/service/cameras/camerasService'
import ModifyActions from './ModifyActions'

interface IGroupList {
  group: MClientGroupCameraList
  clientColumns: GridColDef[]
  handleClose: () => void
  handleGroupModifyId: (groupId: number) => void
  onDrop: () => void
  onDragStart: (row: MClientCameraList) => void
  onDragEnd: () => void
  selectRowEvent: (row: MClientCameraList) => void
}

const GroupList: FC<IGroupList> = ({
  group,
  clientColumns,
  handleClose,
  handleGroupModifyId,
  onDrop,
  onDragStart,
  onDragEnd,
  selectRowEvent
}) => {
  const {
    isGroupModifyMode,
    handleSaveClick,
    handleCancelClick,
    groupModifyId,
    setGroupModifyId,
    selectedCamera,
    setSelectedCamera,
    updateGroupCameraData,
    setIsGroupModifyMode,
    handleGroupCancelClick,
    handleGroupSaveClick,
    deleteGroupCamera,
    updateClientCameraData
  } = useContext(CamerasContext)

  const { setSelectedRow } = useContext(TableContext)
  const [groupOpen, setGroupOpen] = useState(true)
  const [selectGroup, setSelectGroup] = useState(false)
  const { mutateAsync: clientGroupDelete } = useClientGroupDelete()

  const updatedClientColumns = (clientColumns: GridColDef[]): GridColDef[] => {
    return clientColumns.map(column => {
      if (column.field === 'group') {
        return {
          ...column,
          renderCell: () => null
        }
      }

      if (column.field === 'cameraId') {
        return {
          ...column,
          renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconCustom
                  isCommon
                  path='camera'
                  style={{ width: '30px', height: '30px' }}
                  icon={row.flowPlanBindingYN === YN.Y ? 'image-mode' : 'map-mode-full'}
                />

                {row.isEdit ? (
                  <CustomTextFieldState
                    size='small'
                    value={row.cameraId}
                    onChange={e => {
                      updateGroupCameraData(group.groupId, row.cameraNo, { cameraId: e.target.value })
                    }}
                  />
                ) : (
                  <Typography component='span' variant='inherit'>
                    {row.cameraId}
                  </Typography>
                )}
              </Box>
            )
          }
        }
      }
      if (column.field === 'modify') {
        return {
          ...column,
          renderCell: ({ row }: GridRenderCellParams<MClientCameraList>) => {
            return (
              <ModifyActions
                row={row}
                isModify={row.isEdit ?? false}
                isGroupModifyMode={isGroupModifyMode}
                isGroupModify={groupModifyId === group.groupId}
                handleEditClick={() => {
                  updateClientCameraData(row.cameraNo, { isEdit: true })
                  updateGroupCameraData(group.groupId, row.cameraNo, { isEdit: true })
                }}
                handleCancelClick={() => {
                  handleCancelClick(row.cameraNo)
                  updateClientCameraData(row.cameraNo, { isEdit: false })
                  updateGroupCameraData(group.groupId, row.cameraNo, { isEdit: false })
                }}
                handleSaveClick={() => {
                  handleSaveClick(row.cameraNo)
                  updateClientCameraData(row.cameraNo, { isEdit: false })
                  updateGroupCameraData(group.groupId, row.cameraNo, { isEdit: false })
                }}
              />
            )
          }
        }
      }

      return column
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    if (groupModifyId === group.groupId) {
      e.preventDefault()
      e.stopPropagation()
      onDrop()
    }
  }

  useEffect(() => {
    return () => {
      handleClose()
    }
  }, [])

  // useEffect(() => {
  //   if (JSON.stringify(selectedCamera) === JSON.stringify(group.groupItemList)) {
  //     setSelectGroup(true)
  //   } else {
  //     setSelectGroup(false)
  //   }
  // }, [selectedCamera])

  if (isGroupModifyMode && group.groupId !== groupModifyId) {
    return null
  }

  return (
    <Box>
      <Box
        py={2}
        display='flex'
        alignItems='center'
        pl={6}
        gap={3}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          ...(selectGroup && {
            backgroundColor: 'rgba(145, 85, 253, 0.08)'
          }),
          '&:hover': {
            backgroundColor: `${selectGroup ? 'rgba(145, 85, 253, 0.2)' : 'rgba(58, 53, 65, 0.04)'}`
          },
          cursor: 'pointer'
        }}
        onClick={() => {
          setSelectedRow({})
        }}
      >
        <CustomTooltip title={groupOpen ? '접기' : '펼치기'} placement='top'>
          <Box
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => setGroupOpen(!groupOpen)}
          >
            <IconCustom isCommon path='camera' icon={groupOpen ? 'group-open' : 'group-close'} />
          </Box>
        </CustomTooltip>

        {groupModifyId === group.groupId ? (
          <TextField
            size='small'
            value={group.groupName}
            onChange={e => {
              updateGroupCameraData(group.groupId, undefined, { groupName: e.target.value })
            }}
          />
        ) : (
          <Typography component='span' variant='inherit' sx={{ minWidth: '150px', textAlign: 'center' }}>
            {group.groupName}
          </Typography>
        )}
        <PipeLine />
        <Typography component='span' variant='inherit' sx={{ minWidth: '150px', textAlign: 'center' }}>
          {group.groupItemList.length}대의 카메라
        </Typography>

        {groupModifyId === group.groupId ? (
          <Box display='flex' alignItems='center' gap={3} ml={5}>
            <CustomAddCancelButton
              onSaveClick={() => {
                // handleGroupSaveClick(group.groupId)
                handleGroupSaveClick(undefined)
                handleClose()
              }}
              onCancelClick={() => {
                handleGroupCancelClick(group.groupId)
                handleClose()
              }}
            />
            <Box
              sx={{ display: 'flex', cursor: 'pointer' }}
              onClick={async () => {
                try {
                  deleteGroupCamera(group.groupId, undefined)
                  handleClose()
                } catch (error) {
                  console.log(error)
                }
              }}
            >
              <IconCustom isCommon path='camera' icon='trash-blank' hoverIcon='trash-fill' />
            </Box>
          </Box>
        ) : (
          <Box display='flex' alignItems='center'>
            <IconButton
              onClick={() => {
                handleGroupModifyId(group.groupId)
                setGroupModifyId(group.groupId)
              }}
            >
              <IconCustom isCommon path='camera' icon='group-mod-blank' hoverIcon='group-mod-fill' />
            </IconButton>
            <IconButton
              onClick={async () => {
                try {
                  deleteGroupCamera(group.groupId, undefined)
                } catch (error) {
                  console.log(error)
                }
              }}
            >
              <IconCustom isCommon path='camera' icon='trash-blank' hoverIcon='trash-fill' />
            </IconButton>
          </Box>
        )}
      </Box>
      <Collapse in={groupOpen}>
        <DividerBar />
        <CustomTable
          combineTableId={'camera'}
          id='cameraId'
          showMoreButton={false}
          rows={group.groupItemList || []}
          columns={updatedClientColumns(clientColumns)}
          selectRowEvent={selectRowEvent}
          isAllView
          showHeader={false}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          enablePointer
        />
      </Collapse>
      <DividerBar />

      {groupModifyId === group.groupId && (
        <>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            sx={{ backgroundColor: '#F6F1FF', padding: '12px 0px' }}
            gap={10}
          >
            <Box display='flex' alignItems='center' gap={1}>
              <IconCustom isCommon path='camera' icon={'linkIcon-on'} />
              <Typography component='span' variant='inherit'>
                카메라`그룹에 포함될 카메라 항목을 마우스`로 끌어놓거나
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap={1}>
              <IconCustom isCommon path='camera' icon={'linkIcon-on'} />
              <Typography component='span' variant='inherit'>
                링크버튼을 클릭하여 추가하세요
              </Typography>
            </Box>
          </Box>
          <DividerBar />
        </>
      )}
    </Box>
  )
}

export default GroupList
