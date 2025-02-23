import { FC } from 'react'

import { Box, Dialog, IconButton } from '@mui/material'
import DialogCustomContent from 'src/@core/components/molecule/DialogCustomContent'
import IconCustom from 'src/layouts/components/IconCustom'
import { MRoleList, MUserGroup } from 'src/model/userSetting/userSettingModel'
import ContentBody from '../contents-manager/ContentBody'

interface IRoleAddModal {
  isOpen: boolean
  groupInfo?: MUserGroup & MRoleList
  onClose: () => void
  refetch: () => void
}

const ContentsManagerModal: FC<IRoleAddModal> = ({ isOpen, onClose, refetch }) => {
  return (
    <Dialog
      fullWidth
      maxWidth='xl'
      scroll='body'
      onClose={() => {
        onClose()
      }}
      open={isOpen}
    >
      <DialogCustomContent
        modalClose={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => onClose()}>
              <IconCustom icon='modalClose' isCommon />
            </IconButton>
          </Box>
        }
        onClose={() => {
          onClose()
        }}
      >
        <ContentBody isDisabled />
      </DialogCustomContent>
    </Dialog>
  )
}

export default ContentsManagerModal
