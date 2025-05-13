import { ReactNode, createContext, useCallback, useState } from 'react'
import { AuthType } from 'src/model/commonModel'
import { UserDataType } from './types'

export type LayoutValuesType = {
  layoutDisplay: boolean
  setLayoutDisplay: (layoutDisplay: boolean) => void

  companyNo: number
  setCompanyNo: (companyNo: number) => void
  companyId: string
  setCompanyId: (companyId: string) => void
  companyName: string
  setCompanyName: (companyName: string) => void

  layoutUserInfo: UserDataType | null
  setLayoutUserInfo: (layoutUserInfo: UserDataType | null) => void
}

// ** Defaults
const defaultProvider: LayoutValuesType = {
  layoutDisplay: true,
  setLayoutDisplay: () => null,

  companyNo: 0,
  setCompanyNo: () => null,
  companyId: '',
  setCompanyId: () => null,
  companyName: '',
  setCompanyName: () => null,

  layoutUserInfo: null,
  setLayoutUserInfo: () => null
}

const LayoutContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const LayoutProvider = ({ children }: Props) => {
  const [layoutDisplay, setLayoutDisplay] = useState(defaultProvider.layoutDisplay)
  const [companyId, setCompanyId] = useState(defaultProvider.companyId)
  const [companyName, setCompanyName] = useState(defaultProvider.companyName)
  const [companyNo, setCompanyNo] = useState(defaultProvider.companyNo)
  const [layoutUserInfo, setLayoutUserInfo] = useState<UserDataType | null>(null)

  const handleSetLayoutDisplay = useCallback(
    (value: boolean) => {
      if (layoutUserInfo?.userInfo?.authId === AuthType.ADMIN) {
        setLayoutDisplay(value)
      } else {
        setLayoutDisplay(false)
      }
    },
    [layoutUserInfo?.userInfo?.authId]
  )

  const values: LayoutValuesType = {
    layoutDisplay,
    setLayoutDisplay: handleSetLayoutDisplay,
    companyNo,
    setCompanyNo,
    companyId,
    setCompanyId,
    companyName,
    setCompanyName,
    layoutUserInfo,
    setLayoutUserInfo
  }

  return <LayoutContext.Provider value={values}>{children}</LayoutContext.Provider>
}

export { LayoutContext, LayoutProvider }
