// ** React Imports
import { FC, useState } from 'react'

// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import IconCustom from 'src/layouts/components/IconCustom'
import { MRoleList, MUserGroup } from 'src/model/userSetting/userSettingModel'
import { useUserGroup, useUserGroupDel } from 'src/service/setting/userSetting'
import RoleAddModModal from '../modal/RoleAddModModal'

interface IRolesCards {
  data: MUserGroup
  refetch: () => void
}

const RenderCards: FC<IRolesCards> = ({ data, refetch }) => {
  const [isDetail, setIsDetail] = useState(false)
  const [isRoleAddopen, setIsRoleAddopen] = useState<boolean>(false)

  const [groupInfo, setGroupInfo] = useState<MUserGroup & MRoleList>()

  const { mutateAsync: deleteGroup } = useUserGroupDel()
  const { mutateAsync: groupMutate } = useUserGroup()

  const getGroupInfo = async () => {
    const res = await groupMutate({ id: data.id })
    setGroupInfo(res.data)
  }

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
            getGroupInfo()
          }}
        />
      )}

      <Card sx={{ width: 535, height: 155 }}>
        <CardContent sx={{ height: '100%' }}>
          <Box
            sx={{ mb: 3, display: isDetail ? 'none' : 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant='body2'>{`총 ${data.users}명의 사용자`}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', width: '100%' }}>
              <Box sx={{ minHeight: '55px' }}>
                <Typography variant='h6'>{data.name}</Typography>

                <div style={{ display: isDetail ? 'grid' : 'none', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  {groupInfo?.roleList.map(
                    (item, index) =>
                      (item.fullAccess === 'Y' || item.readYn === 'Y') && (
                        <Typography key={index} variant='subtitle2' fontSize={12} sx={{ marginRight: '10px' }}>
                          {item.viewName} :{' '}
                          {item.fullAccess === 'Y' ? 'Full Access' : item.readYn === 'Y' ? 'read' : ''}
                        </Typography>
                      )
                  )}
                </div>
              </Box>

              <div style={{ width: '100%' }}>
                <IconButton
                  sx={{ color: 'text.secondary', padding: '0' }}
                  onClick={async () => {
                    await getGroupInfo()
                    setIsDetail(!isDetail)
                  }}
                >
                  <IconCustom path='settingCard' icon='ContentCopy' />
                  <Typography variant='body2' sx={{ textDecoration: 'none' }}>
                    {isDetail ? '요약' : '상세'}
                  </Typography>
                </IconButton>
                <IconButton
                  onClick={async e => {
                    await getGroupInfo()
                    setIsRoleAddopen(true)
                  }}
                  sx={{ color: 'text.secondary' }}
                >
                  <IconCustom path='settingCard' icon='pen' />
                  <Typography variant='body2' sx={{ textDecoration: 'none' }}>
                    수정
                  </Typography>
                </IconButton>

                <IconButton
                  sx={{ color: 'text.secondary', float: 'right' }}
                  onClick={async () => {
                    if (data.users && data.users > 0) {
                      alert('해당 권한을 사용하는 모든 유저를 먼저 삭제해주세요')

                      return
                    }

                    const result = window.confirm('정말 삭제하시겠습니까?')

                    if (result) {
                      await deleteGroup({ groupId: data.id })
                      refetch()
                    }
                  }}
                >
                  <IconCustom path='settingCard' icon='delete' />
                  <Typography variant='body2'>삭제</Typography>
                </IconButton>
              </div>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default RenderCards
