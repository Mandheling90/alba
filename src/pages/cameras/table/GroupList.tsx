import { Box, Collapse, IconButton, TextField, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useContext, useEffect, useState } from 'react'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import CustomTable from 'src/@core/components/table/CustomTable'
import PipeLine from 'src/@core/components/table/PipeLine'
import { CamerasContext } from 'src/context/CamerasContext'
import { TableContext } from 'src/context/TableContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { MCameraList, MGroupList } from 'src/model/cameras/CamerasModel'
import CameraModifyActions from './CameraModifyActions'

interface IGroupList {
  group: MGroupList
  cameraList: MCameraList[]
  clientColumns: GridColDef[]
  handleClose: () => void
  handleGroupModifyId: (groupId: number) => void
  onDrop: () => void
  onDragStart: (row: MCameraList) => void
  onDragEnd: () => void
  selectRowEvent: (row: MCameraList) => void
}

const GroupList: FC<IGroupList> = ({
  group,
  cameraList,
  clientColumns,
  handleClose,
  handleGroupModifyId,
  onDrop,
  onDragStart,
  onDragEnd,
  selectRowEvent
}) => {
  const {
    cameraGroupLinkDisplay,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    tempClientCameraData,
    groupModifyId,
    setGroupModifyId,
    selectedCamera,
    setSelectedCamera
  } = useContext(CamerasContext)

  const { setSelectedRow } = useContext(TableContext)
  const [groupOpen, setGroupOpen] = useState(true)
  const [selectGroup, setSelectGroup] = useState(false)

  const updatedClientColumns = (clientColumns: GridColDef[]): GridColDef[] => {
    return clientColumns.map(column => {
      if (column.field === 'group') {
        return {
          ...column,
          renderCell: () => null
        }
      }
      if (column.field === 'modify') {
        // console.log(column)

        return {
          ...column,
          renderCell: ({ row }: GridRenderCellParams<MCameraList>) => {
            return (
              <CameraModifyActions
                row={row}
                isModify={tempClientCameraData?.cameraList?.some(camera => camera.id === row.id) ?? false}
                cameraGroupLinkDisplay={cameraGroupLinkDisplay}
                handleEditClick={handleEditClick}
                handleCancelClick={handleCancelClick}
                handleSaveClick={handleSaveClick}
                isGroupModify
              />
            )
          }
        }
      }

      return column
    })
  }

  const handleCloseModify = () => {
    setGroupModifyId(null)
    handleClose()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    if (groupModifyId === group.id) {
      e.preventDefault()
      e.stopPropagation()
      onDrop()
    }
  }

  useEffect(() => {
    if (JSON.stringify(selectedCamera) === JSON.stringify(cameraList)) {
      setSelectGroup(true)
    } else {
      setSelectGroup(false)
    }
  }, [selectedCamera])

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

          // 그룹 선택 시 첫번째 카메라만 선택 - 기획 변경
          setSelectedCamera([cameraList[0]])
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

        {groupModifyId === group.id ? (
          <TextField size='small' value={group.groupName} />
        ) : (
          <Typography component='span' variant='inherit' sx={{ minWidth: '150px', textAlign: 'center' }}>
            {group.groupName}
          </Typography>
        )}
        <PipeLine />
        <Typography component='span' variant='inherit' sx={{ minWidth: '150px', textAlign: 'center' }}>
          {cameraList.length}대의 카메라
        </Typography>

        {groupModifyId === group.id ? (
          <Box display='flex' alignItems='center' gap={3} ml={5}>
            <CustomAddCancelButton onSaveClick={handleCloseModify} onCancelClick={handleCloseModify} />
            <Box
              sx={{ display: 'flex', cursor: 'pointer' }}
              onClick={() => {
                //   console.log(row)
              }}
            >
              <IconCustom isCommon path='camera' icon='trash-blank' hoverIcon='trash-fill' />
            </Box>
          </Box>
        ) : (
          <Box display='flex' alignItems='center'>
            <IconButton
              onClick={() => {
                handleGroupModifyId(group.id)
                setGroupModifyId(group.id)
              }}
            >
              <IconCustom isCommon path='camera' icon='group-mod-blank' hoverIcon='group-mod-fill' />
            </IconButton>
            <IconButton
              onClick={() => {
                //   console.log(row)
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
          rows={cameraList || []}
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

      {groupModifyId === group.id && (
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
