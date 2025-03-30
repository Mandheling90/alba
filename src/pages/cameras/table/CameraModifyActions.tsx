import { Box } from '@mui/material'
import { useContext } from 'react'
import CustomTooltip from 'src/@core/components/atom/CustomTooltip'
import CustomAddCancelButton from 'src/@core/components/molecule/CustomAddCancelButton'
import { CamerasContext } from 'src/context/CamerasContext'
import IconCustom from 'src/layouts/components/IconCustom'
import { MCameraList } from 'src/model/cameras/CamerasModel'

interface CameraModifyActionsProps {
  row: MCameraList
  isModify: boolean
  isGroupModify?: boolean
  cameraGroupLinkDisplay: boolean
  handleEditClick: (row: MCameraList) => void
  handleCancelClick: (id: number) => void
  handleSaveClick: (id: number) => void

  // addCameraToGroup: (groupIndex: number) => void
}

const CameraModifyActions: React.FC<CameraModifyActionsProps> = ({
  row,
  isModify,
  isGroupModify = false,
  cameraGroupLinkDisplay,
  handleEditClick,
  handleCancelClick,
  handleSaveClick

  // addCameraToGroup
}) => {
  const { groupModifyId, updateClientCameraData } = useContext(CamerasContext)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 3 }}>
      {isModify ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CustomAddCancelButton
            onCancelClick={() => handleCancelClick(row.id)}
            onSaveClick={() => handleSaveClick(row.id)}
          />
        </Box>
      ) : (
        <Box sx={{ color: 'text.secondary', cursor: 'pointer' }} onClick={() => handleEditClick(row)}>
          <IconCustom isCommon path='camera' icon='mod-off' hoverIcon='mod-on' />
        </Box>
      )}

      {cameraGroupLinkDisplay && (
        <CustomTooltip title={isGroupModify ? '연결 해제' : '그룹 추가'} placement='top'>
          <Box
            sx={{ color: 'text.secondary', cursor: 'pointer' }}
            onClick={() => {
              if (isGroupModify) {
                updateClientCameraData(row.id, { groupId: null })
              } else {
                if (groupModifyId) {
                  updateClientCameraData(row.id, { groupId: groupModifyId })
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

export default CameraModifyActions
