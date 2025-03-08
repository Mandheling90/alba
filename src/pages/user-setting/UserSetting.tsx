// ** MUI Imports
import { Grid, Typography } from '@mui/material'
import { FC, useEffect } from 'react'

import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PageHeader from 'src/@core/components/page-header'
import RoleCards from 'src/@core/components/userSetting/roles/RoleCards'
import Table from 'src/@core/components/userSetting/table/Table'
import { useUserAll, useUserGroupList } from 'src/service/setting/userSetting'
import { useUserSettingStore } from '.'
import ClientListGrid from './ClientListGrid'

const UserSetting: FC = (): React.ReactElement => {
  const { data: userGroup, refetch: userGroupRefetch } = useUserGroupList()
  const { data: user, refetch: userRefetch } = useUserAll()

  const { setUserGroupInfo } = useUserSettingStore()

  useEffect(() => {
    if (userGroup?.data) {
      setUserGroupInfo(userGroup?.data ?? [])
    }
  }, [setUserGroupInfo, userGroup])

  if (!user?.data || !userGroup?.data) {
    return <></>
  }

  return (
    <StandardTemplate title={'사용자관리'}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ClientListGrid
            data={user.data}
            refetch={() => {
              userRefetch()
              userGroupRefetch()
            }}
          />
        </Grid>

        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={12}>
              <PageHeader
                title={
                  <Typography variant='h5' sx={{ fontSize: 24, fontWeight: 500, mb: 5 }}>
                    시스템 사용자 목록
                  </Typography>
                }
              />
              <Table
                data={user.data}
                refetch={() => {
                  userRefetch()
                  userGroupRefetch()
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mb: 4 }}>
              <RoleCards data={userGroup?.data} refetch={userGroupRefetch}></RoleCards>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StandardTemplate>
  )
}
export default UserSetting
