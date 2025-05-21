// ** MUI Imports
import { Card, Grid, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'

import StandardTemplate from 'src/@core/components/layout/StandardTemplate'
import PageHeader from 'src/@core/components/page-header'

import SlidingLayout from 'src/@core/components/layout/SlidingLayout'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { useUser } from 'src/hooks/useUser'
import { MAuthMenu,MAuthcolumnList } from 'src/model/userSetting/userSettingModel'
import { useAuthList, useAuthMenuList, useUserCompanyList,useUserAuthcolumnList } from 'src/service/setting/userSetting'
import ClientListGrid from './client/ClientListGrid'
import RoleAdd from './userSetting/roles/RoleAdd'
import RoleList from './userSetting/table/RoleList'
import UserList from './userSetting/table/UserList'
import { YN,CRUD } from 'src/enum/commonEnum'

const UserSetting: FC = (): React.ReactElement => {
  const userContext = useUser()
  const { authList, setAuthList, selectedAuthList, setSelectedAuthList,selectedAuthcolumnList,setSelectedAuthcolumnList  } = userContext
  const { layoutDisplay, companyNo } = useLayout()
  const { user } = useAuth()

  const { data: UserCompanyList, refetch: UserCompanyListRefetch } = useUserCompanyList({ companyNo })
  const { data: AuthListData, refetch: AuthListRefetch } = useAuthList({ companyNo })

  const { mutateAsync: authMenuList } = useAuthMenuList()

  const [authMenuListData, setAuthMenuListData] = useState<MAuthMenu>()

  const { mutateAsync: authcolumnList } = useUserAuthcolumnList()
  const [authcolumnListData, setAuthcolumnListData] = useState<MAuthMenu>()


  const fetchData = async () => {
    const filteredList = authList.filter(auth => auth.authId !== user?.userInfo?.authId)

    if (filteredList.length > 0) {
       
      console.log("type:"+selectedAuthList.type)
      if(selectedAuthList.type == CRUD.U){
        const res = await authMenuList({
         authId: selectedAuthList.authId !== 0 ? selectedAuthList.authId : filteredList[0].authId
        })

        setAuthMenuListData(res.data)

        if (!selectedAuthList.authId) {
          setSelectedAuthList({ authId: res.data.authId, name: res.data.authName, userAuthCount: 0, type:CRUD.U })
        }
      }else if(selectedAuthList.type == CRUD.C){
        const column = await authcolumnList()
      
        const columnArray: MAuthcolumnList[] = Array.isArray(column.data) ? column.data : [column.data];
        const convertedData: MAuthMenu = {
          authId: 0,            
          authName: '',
          dataStatus: YN.Y,
          dataStatusStr: YN.Y,
          roles: columnArray
        };
      setAuthMenuListData(convertedData);
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
            <RoleAdd data={authMenuListData} refetch={refetch} />
            
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
