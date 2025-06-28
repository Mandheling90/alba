// ** MUI Imports
import { Card, Grid, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'

import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PageHeader from 'src/@core/components/page-header'

import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import { CRUD, YN } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { useUser } from 'src/hooks/useUser'
import { MAuthMenu, MAuthcolumnList } from 'src/model/userSetting/userSettingModel'
import {
  useAuthList,
  useAuthMenuList,
  useUserAuthcolumnList,
  useUserCompanyList
} from 'src/service/setting/userSetting'
import ClientListGrid from './client/ClientListGrid'
import RoleAdd from './userSetting/roles/RoleAdd'
import RoleList from './userSetting/table/RoleList'
import UserList from './userSetting/table/UserList'

const UserSetting: FC = (): React.ReactElement => {
  const userContext = useUser()
  const { authList, setAuthList, selectedAuthList, setSelectedAuthList } = userContext
  const { layoutDisplay, companyNo } = useLayout()
  const { user } = useAuth()

  const { data: UserCompanyList, refetch: UserCompanyListRefetch } = useUserCompanyList({ companyNo })
  const { data: AuthListData, refetch: AuthListRefetch } = useAuthList({ companyNo })

  const { mutateAsync: authMenuList } = useAuthMenuList()

  const [authMenuListData, setAuthMenuListData] = useState<MAuthMenu>()

  const { mutateAsync: authcolumnList } = useUserAuthcolumnList()

  const fetchData = async () => {
    const filteredList = authList.filter(auth => auth.authId !== user?.userInfo?.authId)

    if (filteredList.length > 0) {
      if (selectedAuthList.type == CRUD.C) {
        const column = await authcolumnList(companyNo)

        const columnArray: MAuthcolumnList[] = Array.isArray(column.data) ? column.data : [column.data]
        const convertedData: MAuthMenu = {
          authId: 0,
          authName: '',
          dataStatus: YN.Y,
          dataStatusStr: YN.Y,
          roles: columnArray
        }
        setAuthMenuListData(convertedData)
      } else {
        const res = await authMenuList({
          authId: selectedAuthList.authId !== 0 ? selectedAuthList.authId : filteredList[0].authId,
          companyNo: companyNo
        })

        setAuthMenuListData(res.data)

        if (!selectedAuthList.authId) {
          setSelectedAuthList({ authId: res.data.authId, name: res.data.authName, userAuthCount: 0, type: CRUD.U })
        }
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [authList, selectedAuthList])

  useEffect(() => {
    if (AuthListData?.data) {
      setAuthList(AuthListData?.data ?? [])
    }
  }, [setAuthList, AuthListData])

  const refetch = () => {
    UserCompanyListRefetch()
    AuthListRefetch()
    fetchData()
  }

  const sideContent = <ClientListGrid />

  const mainContent = (
    <Grid height={'100%'} xs={12} sx={{ display: 'grid', gridTemplateColumns: '100%', gridTemplateRows: '1fr 35vh' }}>
      <Grid item container xs={12} mb={5}>
        <PageHeader
          title={
            <Typography variant='h5' sx={{ fontSize: 24, fontWeight: 500, mb: 5 }}>
              시스템 사용자 목록
            </Typography>
          }
        />

        <Card sx={{ width: '100%', minHeight: '39vh', overflow: 'auto' }}>
          <UserList data={UserCompanyList?.data ?? []} refetch={refetch} />
        </Card>
      </Grid>

      <Grid item container xs={12} sx={{ maxHeight: '100%' }}>
        <Grid item xs={5} sx={{ maxHeight: '100%', overflowY: 'auto' }}>
          <Card sx={{ minHeight: '100%' }}>
            <RoleList data={authList ?? []} refetch={refetch} />
          </Card>
        </Grid>
        <Grid item xs={7} pl={5} sx={{ height: '100%', overflowY: 'auto' }}>
          <Card sx={{ minHeight: '100%' }}>
            <RoleAdd data={authMenuListData} refetch={refetch} />
          </Card>
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
