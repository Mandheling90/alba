import { Box, IconButton, TextField, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import CustomTable from 'src/@core/components/table/CustomTable'
import PipeLine from 'src/@core/components/table/PipeLine'
import IconCustom from 'src/layouts/components/IconCustom'
import { MGroupList } from 'src/model/cameras/CamerasModel'

interface IGroupList {
  groupList: MGroupList[]
  clientColumns: GridColDef[]
  isAddOpen: boolean
  isModify: boolean
  handleClose: () => void
  handleGroupModifyId: (groupId: string) => void
}

const GroupList: FC<IGroupList> = ({
  groupList,
  clientColumns,
  isAddOpen,
  isModify,
  handleClose,
  handleGroupModifyId
}) => {
  const [groupModifyId, setGroupModifyId] = useState('')

  const updatedClientColumns = (clientColumns: GridColDef[]): GridColDef[] => {
    return clientColumns.map(column => {
      if (column.field === 'group') {
        return {
          ...column,
          renderCell: () => null
        }
      }

      return column
    })
  }

  const handleCloseModify = () => {
    setGroupModifyId('')
    handleClose()
  }

  return (
    <Box>
      {groupList.map((group, index) => (
        <>
          <Box my={2} display='flex' alignItems='center' ml={6} gap={3}>
            <IconCustom isCommon path='camera' icon='group-open' />
            {groupModifyId === group.groupId ? (
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

            {groupModifyId === group.groupId ? (
              <Box display='flex' alignItems='center' gap={3} ml={5}>
                <CustomAddCancelButton onSaveClick={handleCloseModify} onCancelClick={handleCloseModify} />
                <IconButton
                  onClick={() => {
                    //   console.log(row)
                  }}
                >
                  <IconCustom isCommon path='camera' icon='trash-blank' hoverIcon='trash-fill' />
                </IconButton>
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
                  onClick={() => {
                    //   console.log(row)
                  }}
                >
                  <IconCustom isCommon path='camera' icon='trash-blank' hoverIcon='trash-fill' />
                </IconButton>
              </Box>
            )}
          </Box>

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
          <DividerBar />
        </>
      ))}
    </Box>
  )
}

export default GroupList
