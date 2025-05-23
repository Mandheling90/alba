import { FC, useEffect, useState } from 'react'

import { Box, Button, IconButton, Switch, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import DividerBar from 'src/@core/components/atom/DividerBar'
import CustomTable from 'src/@core/components/table/CustomTable'
import { YN,CRUD } from 'src/enum/commonEnum'
import { useAuth } from 'src/hooks/useAuth'
import { useUser } from 'src/hooks/useUser'
import IconCustom from 'src/layouts/components/IconCustom'
import { MAuthList,MAuthcolumnList } from 'src/model/userSetting/userSettingModel'
import { useAuthStatusMod, useDelAuth,useUserAuthcolumnList } from 'src/service/setting/userSetting'

interface IUserList {
  data: MAuthList[]
  refetch: () => void
}

const RoleList: FC<IUserList> = ({ data, refetch }) => {
  const { mutateAsync: authDel } = useDelAuth()
  const { mutateAsync: authStatusMod } = useAuthStatusMod()

  //const { mutateAsync: authDel } = useUserAuthcolumnList()

  const { setSelectedAuthList } = useUser()
const { mutateAsync: authcolumnList } = useUserAuthcolumnList()
  const [userData, setUserData] = useState<MAuthList[]>([])
  const [usercolumnList, setUsercolumnList] = useState<MAuthcolumnList[]>([])

  const { user } = useAuth()

  useEffect(() => {
    setUserData(data.map(obj => ({ ...obj, display: true })))
  }, [data])

  const authDeleteFn = async (id: number) => {
    const result = window.confirm('정말삭제 하시겠습니까?')

    if (result) {
      await authDel({ authId: id })
      refetch()
    }
  }

  const columns = [
    { field: 'name', headerName: '사용자권한명', flex: 1 },
    { field: 'userAuthCount', headerName: '사용자수', flex: 1 },
    {
      field: 'status',
      headerName: '상태',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Switch
            disabled={row.authId === user?.userInfo?.authId}
            checked={row.dataStatus === YN.Y}
            onChange={event => {
              authStatusMod({ authId: row.authId, dataStatus: event.target.checked ? YN.Y : YN.N })
              const updatedList = userData.map(user => {
                if (user.authId === row.authId) {
                  return { ...user, dataStatus: event.target.checked ? YN.Y : YN.N }
                }

                return user
              })
              setUserData(updatedList)
            }}
          />
        )
      }
    },
    {
      field: 'updateDelete',
      headerName: '수정 및 삭제',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <>
            <IconButton
              sx={{ color: 'text.secondary' }}
              disabled={row.authId === user?.userInfo?.authId}
              onClick={e => {
                setSelectedAuthList({ authId: row.authId, name: row.name, userAuthCount: row.userAuthCount, type:CRUD.U })
              }}
            >
              <IconCustom path='settingCard' icon='pen' />
              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              disabled={row.authId === user?.userInfo?.authId}
              onClick={e => {
                authDeleteFn(row.authId)
              }}
            >
              <IconCustom path='settingCard' icon='delete' />
              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
          </>
        )
      }
    }
  ]

  return (
    <>
      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', m: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={'contained'}
              startIcon={<IconCustom isCommon icon='plus' />}
              onClick={() => {
                setSelectedAuthList({ authId: 0, name: '', userAuthCount: 0, type:CRUD.C })
              }}
              sx={{
                clipPath: 'polygon(0 0, 80% 0, 95% 50%, 80% 100%, 0 100%, 0% 50%)',
                paddingRight: '2rem'
              }}
            >
              권한 추가
            </Button>
          </Box>
        </Box>
        <Box sx={{ minHeight: '32vh', maxHeight: '32vh', overflow: 'auto' }}>
          <CustomTable
            id='authId'
            showMoreButton={false}
            rows={userData}
            columns={columns}
            isAllView

            // enablePointer
            // selectRowEvent={handleCheckboxSelection}
          />

          <DividerBar />
        </Box>
      </Card>
    </>
  )
}

export default RoleList
