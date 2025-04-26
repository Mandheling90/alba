// ** MUI Imports
import { Card, Grid, Typography } from '@mui/material'
import { FC, useEffect } from 'react'

import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PageHeader from 'src/@core/components/page-header'

import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { useUser } from 'src/hooks/useUser'
import { useAuthList, useAuthMenuList, useUserCompanyList } from 'src/service/setting/userSetting'
import ClientListGrid from './client/ClientListGrid'
import RoleAdd from './userSetting/roles/RoleAdd'
import RoleList from './userSetting/table/RoleList'
import UserList from './userSetting/table/UserList'

const UserSetting: FC = (): React.ReactElement => {
  const userContext = useUser()
  const { authList, setAuthList, selectedAuthList } = userContext
  const { user } = useAuth()
  const { layoutDisplay, setCompanyId, setCompanyName, companyId, companyName, companyNo, setCompanyNo } = useLayout()

  const { data: UserCompanyList, refetch: UserCompanyListRefetch } = useUserCompanyList({ companyNo })
  const { data: AuthListData, refetch: AuthListRefetch } = useAuthList({ companyNo })
  const { data: AuthMenuList, refetch: AuthMenuListRefetch } = useAuthMenuList({
    authId: selectedAuthList.authId === 0 ? 1 : selectedAuthList.authId
  })

  useEffect(() => {
    if (AuthListData?.data) {
      setAuthList(AuthListData?.data ?? [])
    }
  }, [setAuthList, AuthListData])

  const refetch = () => {
    UserCompanyListRefetch()
    AuthListRefetch()
    AuthMenuListRefetch()
  }

  const sideContent = <ClientListGrid />

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

        <Card sx={{ minHeight: '39vh', overflow: 'auto' }}>
          <UserList data={UserCompanyList?.data ?? []} refetch={refetch} />
        </Card>
      </Grid>

      <Grid item xs={12} sx={{ maxHeight: '42vh', overflow: 'auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={5}>
            <RoleList data={authList ?? []} refetch={refetch} />
          </Grid>
          <Grid item xs={7}>
            <RoleAdd data={AuthMenuList?.data} refetch={refetch} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <StandardTemplate title={'사용자관리'}>
      <SlidingLayout isOpen={layoutDisplay} sideContent={sideContent} mainContent={mainContent} maxHeight='85vh' />
    </StandardTemplate>
  )
}

export default UserSetting
