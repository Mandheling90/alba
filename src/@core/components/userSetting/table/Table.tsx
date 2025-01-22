import { FC, useCallback, useEffect, useState } from 'react'

import { IconButton, Switch, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid } from '@mui/x-data-grid'
import { useAuth } from 'src/hooks/useAuth'
import IconCustom from 'src/layouts/components/IconCustom'
import { UserListAll } from 'src/model/userSetting/userSettingModel'
import { useUserArrDel, useUserMod } from 'src/service/setting/userSetting'
import { exportToExcel } from 'src/utils/CommonUtil'
import UserAddModModal from '../modal/UserAddModModal'
import TableHeader from './TableHeader'

interface IUserList {
  data: UserListAll[]
  refetch: () => void
}

const UserList: FC<IUserList> = ({ data, refetch }) => {
  const { mutateAsync: userDel } = useUserArrDel()
  const { mutateAsync: modUser } = useUserMod()

  // ** State
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [userData, setUserData] = useState<UserListAll[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [selectUser, setSelectUser] = useState<UserListAll>()

  const [userCheck, setUserCheck] = useState<string[]>([])

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

  const handleFilter = useCallback(
    (val: string) => {
      if (val !== '') {
        const newData = userData.map(obj => {
          const shouldDisplay = !obj.name || obj.name.toLowerCase().includes(val)

          return { ...obj, display: shouldDisplay }
        })

        setUserData(newData)
      } else {
        const newData = userData.map(obj => ({ ...obj, display: true }))
        setUserData(newData)
      }

      setValue(val)
    },
    [userData]
  )

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

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

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              plan={plan}
              value={value}
              handleFilter={handleFilter}
              handlePlanChange={handlePlanChange}
              userCheck={userCheck}
              refetch={refetch}
              onExport={() => {
                exportToExcel(data, '유저리스트')
              }}
            />
            <DataGrid
              autoHeight
              rows={userData
                ?.map((item, index) => {
                  return {
                    ...item,
                    display: item.display ?? true,
                    groupName: item.group.name
                  }
                })
                .filter(row => row.display)}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={e => {
                console.log(e)

                setUserCheck(e as string[])
              }}
              isRowSelectable={(params: any) => params.row.id !== auth?.user?.userInfo?.id}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default UserList
