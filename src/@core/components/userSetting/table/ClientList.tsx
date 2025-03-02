import { FC, useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid } from '@mui/x-data-grid'
import { useAuth } from 'src/hooks/useAuth'
import { UserListAll } from 'src/model/userSetting/userSettingModel'
import { useUserArrDel, useUserMod } from 'src/service/setting/userSetting'

interface IClientList {
  data: UserListAll[]
  refetch: () => void
}

const ClientList: FC<IClientList> = ({ data, refetch }) => {
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
    { field: 'id', headerName: '이메일 주소', flex: 1 }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
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
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 100 }
                }
              }}
              pageSizeOptions={[100]}
              hideFooterPagination
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

export default ClientList
