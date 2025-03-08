import { FC, useCallback, useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { SelectChangeEvent } from '@mui/material/Select'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useAuth } from 'src/hooks/useAuth'
import { UserListAll } from 'src/model/userSetting/userSettingModel'
import { useUserArrDel, useUserMod } from 'src/service/setting/userSetting'

interface IClientList {
  data: UserListAll[]
  refetch: () => void
  selectRowEvent: (row: any) => void
}

const ClientSimpleList: FC<IClientList> = ({ data, refetch, selectRowEvent }) => {
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
    { field: 'name', headerName: '고객사 ID', flex: 1 },
    { field: 'id', headerName: '고객사 명', flex: 1 }
  ]

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <CustomTable
              showMoreButton
              rows={userData}
              columns={columns}
              isAllView
              selectRowEvent={selectRowEvent}
              checkboxSelection={false}
              enablePointer
            />
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default ClientSimpleList
