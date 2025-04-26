import { FC, useEffect, useState } from 'react'

import CustomTable from 'src/@core/components/table/CustomTable'
import { useAuth } from 'src/hooks/useAuth'
import { useLayout } from 'src/hooks/useLayout'
import { MCompanySearch } from 'src/model/client/clientModel'

interface IClientList {
  data: MCompanySearch[]
  refetch: () => void
  selectRowEvent: (row: any) => void
}

const ClientSimpleList: FC<IClientList> = ({ data, refetch, selectRowEvent }) => {
  const { companyId } = useLayout()
  const { user } = useAuth()

  const [userData, setUserData] = useState<(MCompanySearch & { display: boolean })[]>([])

  useEffect(() => {
    if (data.length > 0) {
      setUserData(data.map(obj => ({ ...obj, display: true })))
    }
  }, [data])

  const columns = [
    { field: 'companyId', headerName: '고객사 ID', flex: 1 },
    { field: 'companyName', headerName: '고객사 명', flex: 1 }
  ]

  return (
    <CustomTable
      id='companyId'
      showMoreButton
      rows={userData}
      columns={columns}
      isAllView
      selectRowEvent={selectRowEvent}
      enablePointer
      initialSelectedRow={companyId ? companyId : user?.userInfo?.companyId}
      requireSingleSelection
    />
  )
}

export default ClientSimpleList
