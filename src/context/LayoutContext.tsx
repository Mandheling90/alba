import { ReactNode, createContext, useState } from 'react'

export type LayoutValuesType = {
  layoutDisplay: boolean
  setLayoutDisplay: (layoutDisplay: boolean) => void

  companyId: string
  setCompanyId: (companyId: string) => void
  companyName: string
  setCompanyName: (companyName: string) => void
}

// ** Defaults
const defaultProvider: LayoutValuesType = {
  layoutDisplay: true,
  setLayoutDisplay: () => null,

  companyId: '',
  setCompanyId: () => null,
  companyName: '',
  setCompanyName: () => null
}

const LayoutContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const LayoutProvider = ({ children }: Props) => {
  const [layoutDisplay, setLayoutDisplay] = useState(defaultProvider.layoutDisplay)
  const [companyId, setCompanyId] = useState(defaultProvider.companyId)
  const [companyName, setCompanyName] = useState(defaultProvider.companyName)

  const values: LayoutValuesType = {
    layoutDisplay,
    setLayoutDisplay,

    companyId,
    setCompanyId,
    companyName,
    setCompanyName
  }

  return <LayoutContext.Provider value={values}>{children}</LayoutContext.Provider>
}

export { LayoutContext, LayoutProvider }
