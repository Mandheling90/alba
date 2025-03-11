import { FC, useCallback, useEffect, useState } from 'react'

import { SelectChangeEvent } from '@mui/material/Select'
import CustomTable from 'src/@core/components/table/CustomTable'
import { useAuth } from 'src/hooks/useAuth'
import { IClient } from 'src/model/client/clientModel'
import { useUserArrDel, useUserMod } from 'src/service/setting/userSetting'

interface IClientList {
  data: IClient[]
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

  const [userData, setUserData] = useState<(IClient & { display: boolean })[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [selectUser, setSelectUser] = useState<IClient>()

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
          const shouldDisplay = !obj.clientName || obj.clientName.toLowerCase().includes(val)

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
    { field: 'clientId', headerName: '고객사 ID', flex: 1 },
    { field: 'clientName', headerName: '고객사 명', flex: 1 }
  ]

  return (
    <CustomTable
      id='clientId'
      showMoreButton
      rows={userData}
      columns={columns}
      isAllView
      selectRowEvent={selectRowEvent}
      enablePointer
    />
  )
}

export default ClientSimpleList
