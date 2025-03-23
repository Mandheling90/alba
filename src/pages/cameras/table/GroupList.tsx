import { Box, Collapse, IconButton, TextField, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import CustomTable from 'src/@core/components/table/CustomTable'
import PipeLine from 'src/@core/components/table/PipeLine'
import { useCameras } from 'src/hooks/useCameras'
import IconCustom from 'src/layouts/components/IconCustom'
import { MCameraList, MGroupList } from 'src/model/cameras/CamerasModel'
import CameraModifyActions from './CameraModifyActions'

interface IGroupList {
  group: MGroupList
  clientColumns: GridColDef[]
  isAddOpen: boolean
  isModify: boolean
  handleClose: () => void
  handleGroupModifyId: (groupId: string) => void
}

const GroupList: FC<IGroupList> = ({ group, clientColumns, isAddOpen, isModify, handleClose, handleGroupModifyId }) => {
  const cameraContext = useCameras()
  const { cameraGroupLinkDisplay, handleEditClick, handleSaveClick, handleCancelClick, tempClientCameraData } =
    cameraContext

  const [isGroupModifyId, setIsGroupModifyId] = useState(false)
  const [groupOpen, setGroupOpen] = useState(true)

  const updatedClientColumns = (clientColumns: GridColDef[]): GridColDef[] => {
    return clientColumns.map(column => {
      if (column.field === 'group') {
        return {
          ...column,
          renderCell: () => null
        }
      }
      if (column.field === 'modify') {
        console.log(column)

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
    setIsGroupModifyId(false)
    handleClose()
  }

  return (
    <Box>
      <>
        <Box my={2} display='flex' alignItems='center' ml={6} gap={3}>
          <CustomTooltip title={groupOpen ? '접기' : '펼치기'} placement='top'>
            <Box sx={{ cursor: 'pointer' }} onClick={() => setGroupOpen(!groupOpen)}>
              <IconCustom isCommon path='camera' icon={groupOpen ? 'group-open' : 'group-close'} />
            </Box>
          </CustomTooltip>

          {isGroupModifyId ? (
            <TextField size='small' value={group.groupName} />
          ) : (
            <Typography component='span' variant='inherit' sx={{ minWidth: '150px', textAlign: 'center' }}>
              {group.groupName}
            </Typography>
          )}
          <PipeLine />
          <Typography component='span' variant='inherit' sx={{ minWidth: '150px', textAlign: 'center' }}>
            {group.cameraList.length}대의 카메라
          </Typography>

          {isGroupModifyId ? (
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
                  handleGroupModifyId(group.groupId)
                  setIsGroupModifyId(true)
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
            id='cameraId'
            showMoreButton={false}
            rows={group.cameraList || []}
            columns={updatedClientColumns(clientColumns)}
            selectRowEvent={(row: IGroupList) => {
              console.log(row)
            }}
            isAllView
            showHeader={false}
          />
        </Collapse>
        <DividerBar />

        {isGroupModifyId && (
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
                  카메라그룹에 포함될 카메라 항목을 마우스로 끌어놓거나
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
      </>
    </Box>
  )
}

export default GroupList
