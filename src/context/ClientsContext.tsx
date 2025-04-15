import { ReactNode, createContext, useState } from 'react'

import { MClientListReq, MList, SEARCH_TYPE } from 'src/model/client/clientModel'

export type ClientsValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void

  clientListReq: MClientListReq
  setClientListReq: (value: MClientListReq) => void

  selectClientData: MList[]
  setSelectClientData: (value: MList[]) => void
}

// ** Defaults
const defaultProvider: ClientsValuesType = {
  loading: true,
  setLoading: () => Boolean,

  clientListReq: {
    searchType: SEARCH_TYPE.ALL,
    keyword: '',
    offset: 0,
    size: 1000
  },
  setClientListReq: () => null,

  selectClientData: [],
  setSelectClientData: () => []
}

const ClientsContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const ClientsProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({})

  const [clientListReq, setClientListReq] = useState<MClientListReq>(defaultProvider.clientListReq)
  const [selectClientData, setSelectClientData] = useState<MList[]>(defaultProvider.selectClientData)

  const values: ClientsValuesType = {
    loading,
    setLoading,
    clientListReq,
    setClientListReq,
    selectClientData,
    setSelectClientData
  }

  return <ClientsContext.Provider value={values}>{children}</ClientsContext.Provider>
}

export { ClientsContext, ClientsProvider }
