import { FC, useEffect, useState } from 'react'

import { Box, Button, IconButton, Switch, Typography } from '@mui/material'
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
    { field: 'name', headerName: '사용자명', flex: 1 },
    {
      field: 'name2',
      headerName: '사용자 ID',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.name}
          </Typography>
        )
      }
    },
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
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return (
          <Switch
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

            // disabled={row.id === auth?.user?.userInfo?.id}
          />
        )
      }
    },
    {
      field: 'updateDelete',
      headerName: '수정 및 삭제',
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 1 }}>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={e => {
                setSelectUser(row)
                setIsOpen(true)
              }}
            >
              <IconCustom path='settingCard' icon='pen' />
              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={e => {
                userDeleteFn(row.id)
              }}
            >
              <IconCustom path='settingCard' icon='delete' />
              <Typography sx={{ textDecoration: 'none' }}></Typography>
            </IconButton>
          </Box>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3 }}>
              <LayoutControlPanel
                menuName='사용자'
                id='user'
                selectedTarget='user'
                onClick={() => {
                  userContext.setLayoutDisplay(!userContext.layoutDisplay)
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={'contained'}
                  startIcon={<IconCustom isCommon icon='plus' />}
                  onClick={() => {
                    setSelectUser(undefined)
                    setIsOpen(true)
                  }}
                >
                  사용자 추가
                </Button>

                <Button
                  variant={'contained'}
                  startIcon={<IconCustom isCommon icon='minus' />}
                  onClick={async () => {
                    const result = window.confirm('정말삭제 하시겠습니까?')

                    if (result) {
                      // await userDel({ idList: userCheck })
                      // refetch()
                    }
                  }}
                >
                  사용자 삭제
                </Button>
              </Box>
            </Box>
            <Box sx={{ maxHeight: '33.5vh', overflow: 'auto' }}>
              <CustomTable
                rows={userData}
                columns={columns}
                onCheckboxSelectionChange={handleCheckboxSelection}
                isAllView
                enablePointer
                selectRowEvent={e => {
                  userContext.setSelectedGroupId(e.group.id)
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default UserList
