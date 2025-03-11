// ** MUI Imports
import { Box, Grid, Typography } from '@mui/material'
import { FC, useEffect } from 'react'

import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PageHeader from 'src/@core/components/page-header'
import { useUserAll, useUserGroupList } from 'src/service/setting/userSetting'

import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import { useUser } from 'src/hooks/useUser'
import ClientListGrid from './client/ClientListGrid'
import RoleAdd from './userSetting/roles/RoleAdd'
import RoleList from './userSetting/table/RoleList'
import UserList from './userSetting/table/UserList'

const UserSetting: FC = (): React.ReactElement => {
  const userContext = useUser()

  const { data: userGroup, refetch: userGroupRefetch } = useUserGroupList()
  const { data: user, refetch: userRefetch } = useUserAll()

  useEffect(() => {
    if (userGroup?.data) {
      userContext.setUserGroupInfo(userGroup?.data ?? [])
    }
  }, [userContext.setUserGroupInfo, userGroup])

  if (!user?.data || !userGroup?.data) {
    return <></>
  }

  const handleSelectClientGrid = (row: any) => {
    console.log(row)
  }

  const sideContent = <ClientListGrid selectRowEvent={handleSelectClientGrid} />

  const mainContent = (
    <Grid container>
      <Grid item xs={12} mb={5}>
        <PageHeader
          title={
            <Typography variant='h5' sx={{ fontSize: 24, fontWeight: 500, mb: 5 }}>
              시스템 사용자 목록
            </Typography>
          }
        />
        <Box>
          <UserList
            data={user.data}
            refetch={() => {
              userRefetch()
              userGroupRefetch()
            }}
          />
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ maxHeight: '42vh', overflow: 'auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={5}>
            <RoleList
              data={userGroup?.data}
              refetch={() => {
                userGroupRefetch()
              }}
            />
          </Grid>
          <Grid item xs={7}>
            <RoleAdd
              data={userGroup?.data}
              refetch={() => {
                userGroupRefetch()
              }}
              onClose={function (): void {
                throw new Error('Function not implemented.')
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <StandardTemplate title={'사용자관리'}>
      <SlidingLayout
        isOpen={userContext.layoutDisplay}
        sideContent={sideContent}
        mainContent={mainContent}
        maxHeight='85vh'
      />
    </StandardTemplate>
  )
}

export default UserSetting
