import { FC, useEffect, useState } from 'react'

import { Box, IconButton, Switch, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import LayoutControlPanel from 'src/@core/components/molecule/LayoutControlPanel'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useAuth } from 'src/hooks/useAuth'
import { useUser } from 'src/hooks/useUser'
import IconCustom from 'src/layouts/components/IconCustom'
import { UserListAll } from 'src/model/userSetting/userSettingModel'
import { useUserArrDel, useUserMod } from 'src/service/setting/userSetting'
import UserAddModModal from '../modal/UserAddModModal'

interface IUserList {
  data: UserListAll[]
  refetch: () => void
}

const UserList: FC<IUserList> = ({ data, refetch }) => {
  const { mutateAsync: userDel } = useUserArrDel()
  const { mutateAsync: modUser } = useUserMod()

  const userContext = useUser()

  const [userData, setUserData] = useState<UserListAll[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [selectUser, setSelectUser] = useState<UserListAll>()

  const auth = useAuth()

  useEffect(() => {
    setUserData(data.map(obj => ({ ...obj, display: true })))
  }, [data])

  const userDeleteFn = async (id: string) => {
    const result = window.confirm('정말삭제 하시겠습니까?')

    if (result) {
      await userDel({ idList: [id] })
      refetch()
    }
  }

  const columns = [
    { field: 'name', headerName: '사용자', flex: 1 },
    { field: 'id', headerName: '이메일 주소', flex: 1 },
    {
      field: 'groupName',
      headerName: '권한',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.groupName}
          </Typography>
        )
      }
    },
    {
      field: 'status',
      headerName: '상태',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Switch
            disabled={row.id === auth?.user?.userInfo?.id}
            checked={row.status === 1}
            onChange={event => {
              modUser({ id: row.id, status: event.target.checked ? 1 : 0 })
              const updatedList = userData.map(user => {
                if (user.id === row.id) {
                  return { ...user, status: event.target.checked ? 1 : 0 }
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
              disabled={row.id === auth?.user?.userInfo?.id}
              onClick={e => {
                setSelectUser(row)
                setIsOpen(true)
              }}
            >
              {row.id !== auth?.user?.userInfo?.id && <IconCustom path='settingCard' icon='pen' />}

              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              disabled={row.id === auth?.user?.userInfo?.id}
              onClick={e => {
                userDeleteFn(row.id)
              }}
            >
              {row.id !== auth?.user?.userInfo?.id && <IconCustom path='settingCard' icon='delete' />}

              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
          </>
        )
      }
    }
  ]

  const handleCheckboxSelection = (selectedRows: any[]) => {
    console.log(selectedRows)
  }

  return (
    <>
      {isOpen && (
        <UserAddModModal
          isOpen={isOpen}
          selectUser={selectUser}
          onClose={() => {
            setIsOpen(false)
          }}
          onSubmitAfter={() => {
            refetch()
          }}
        />
      )}

      <Grid container>
        <Grid item xs={12}>
          <Card>
            <LayoutControlPanel
              menuName='사용자'
              id='user'
              selectedTarget='user'
              onClick={() => {
                userContext.setLayoutDisplay(!userContext.layoutDisplay)
              }}
            />
            <Box sx={{ maxHeight: '30vh', overflow: 'auto' }}>
              <CustomTable
                showMoreButton={true}
                rows={userData}
                columns={columns}
                onCheckboxSelectionChange={handleCheckboxSelection}
                isAllView
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default UserList
