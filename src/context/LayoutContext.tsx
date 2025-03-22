import { ReactNode, createContext, useState } from 'react'

export type LayoutValuesType = {
  layoutDisplay: boolean
  setLayoutDisplay: (layoutDisplay: boolean) => void
}

// ** Defaults
const defaultProvider: LayoutValuesType = {
  layoutDisplay: true,
  setLayoutDisplay: () => null
}

const LayoutContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const LayoutProvider = ({ children }: Props) => {
  const [layoutDisplay, setLayoutDisplay] = useState(defaultProvider.layoutDisplay)

  const values: LayoutValuesType = {
    layoutDisplay,
    setLayoutDisplay
  }

  return <LayoutContext.Provider value={values}>{children}</LayoutContext.Provider>
}

export { LayoutContext, LayoutProvider }
