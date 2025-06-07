import { Box } from '@mui/material'
import { useContext } from 'react'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import { CamerasContext } from 'src/context/CamerasContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { MClientCameraList } from 'src/model/cameras/CamerasModel'

interface ModifyActionsProps {
  row: MClientCameraList
  isModify: boolean
  isGroupModify?: boolean
  isGroupModifyMode?: boolean
  handleEditClick: (row: MClientCameraList) => void
  handleCancelClick: (cameraNo: number) => void
  handleSaveClick: (cameraNo: number) => void

  // addCameraToGroup: (groupIndex: number) => void
}

const ModifyActions: React.FC<ModifyActionsProps> = ({
  row,
  isModify,
  isGroupModify = false,
  isGroupModifyMode = false,
  handleEditClick,
  handleCancelClick,
  handleSaveClick
}) => {
  const { groupModifyId, addGroupCamera, deleteGroupCamera } = useContext(CamerasContext)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 3 }}>
      {isModify ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CustomAddCancelButton
            onCancelClick={() => handleCancelClick(row.cameraNo)}
            onSaveClick={() => handleSaveClick(row.cameraNo)}
          />
        </Box>
      ) : (
        <Box
          sx={{ color: 'text.secondary', cursor: 'pointer' }}
          onClick={e => {
            e.stopPropagation()
            handleEditClick(row)
          }}
        >
          <IconCustom isCommon path='camera' icon='mod-off' hoverIcon='mod-on' />
        </Box>
      )}

      {isGroupModifyMode && (
        <CustomTooltip title={isGroupModify ? '연결 해제' : '그룹 추가'} placement='top'>
          <Box
            sx={{ color: 'text.secondary', cursor: 'pointer' }}
            onClick={e => {
              if (groupModifyId) {
                e.stopPropagation()
                if (isGroupModify) {
                  deleteGroupCamera(groupModifyId, row.cameraNo)
                } else {
                  addGroupCamera(groupModifyId, row)
                }
              }
            }}
          >
            <IconCustom
              isCommon
              path='camera'
              icon={isGroupModify ? 'unLink' : 'linkIcon-on'}
              hoverIcon={isGroupModify ? 'unLink-hover' : 'linkIcon-on'}
            />
          </Box>
        </CustomTooltip>
      )}
    </Box>
  )
}

export default ModifyActions
