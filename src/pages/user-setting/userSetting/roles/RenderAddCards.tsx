// ** React Imports
import { FC, useState } from 'react'

// ** Next Import

// ** MUI Imports
import Card from '@mui/material/Card'

// ** Icon Imports
import { Box, IconButton, Typography } from '@mui/material'
import IconCustom from 'src/layouts/components/IconCustom'
import { MRoleList, MUserGroup } from 'src/model/userSetting/userSettingModel'
import { useUserGroup, useUserGroupDel } from 'src/service/setting/userSetting'
import RoleAddModModal from '../modal/RoleAddModModal'

interface IRenderAddCards {
  refetch: () => void
}

const RenderAddCards: FC<IRenderAddCards> = ({ refetch }) => {
  const [isDetail, setIsDetail] = useState(false)
  const [isRoleAddopen, setIsRoleAddopen] = useState<boolean>(false)

  const [groupInfo, setGroupInfo] = useState<MUserGroup & MRoleList>()

  const { mutateAsync: deleteGroup } = useUserGroupDel()
  const { mutateAsync: groupMutate } = useUserGroup()

  return (
    <>
      {isRoleAddopen && (
        <RoleAddModModal
          isOpen={isRoleAddopen}
          groupInfo={groupInfo}
          onClose={() => {
            setIsRoleAddopen(false)
          }}
          refetch={() => {
            refetch()

            // getGroupInfo()
          }}
        />
      )}

      <Card sx={{ width: 535, height: 155, m: 0, p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 6 }}>
            <IconButton
              onClick={() => {
                console.log('search')
              }}
            >
              <IconCustom isCommon icon='add-button' />
            </IconButton>

            <Typography variant='h6'>권한추가</Typography>
          </Box>
          <Box sx={{ display: 'flex', m: 0, p: 0, alignSelf: 'flex-end' }}>
            <IconCustom isCommon icon='cardAddSetting' />
          </Box>
        </Box>
      </Card>
    </>
  )
}

export default RenderAddCards
