// ** MUI Imports
import { Box, Grid, Typography } from '@mui/material'
import { FC, useEffect } from 'react'

import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PageHeader from 'src/@core/components/page-header'
import { useUserAll, useUserGroupList } from 'src/service/setting/userSetting'

import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import { useUser } from 'src/hooks/useUser'
import ClientListGrid from './client/ClientListGrid'
import RoleCards from './userSetting/roles/RoleCards'
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

  console.log(userContext.layoutDisplay)

  const sideContent = (
    <ClientListGrid
      data={user.data}
      refetch={() => {
        userRefetch()
        userGroupRefetch()
      }}
      selectRowEvent={handleSelectClientGrid}
    />
  )

  const mainContent = (
    <Grid container>
      <Grid item xs={12}>
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

      <Grid item xs={12} sx={{ maxHeight: '42.5vh', overflow: 'auto', mb: 4 }}>
        <RoleCards data={userGroup?.data} refetch={userGroupRefetch} />
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
