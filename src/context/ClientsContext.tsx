import { ReactNode, createContext, useState } from 'react'

export type ClientsValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
}

// ** Defaults
const defaultProvider: ClientsValuesType = {
  loading: true,
  setLoading: () => Boolean
}

const ClientsContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const ClientsProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({})

  const values: ClientsValuesType = {
    loading,
    setLoading
  }

  return <ClientsContext.Provider value={values}>{children}</ClientsContext.Provider>
}

export { ClientsContext, ClientsProvider }
