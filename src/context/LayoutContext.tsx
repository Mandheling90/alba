import { ReactNode, createContext, useCallback, useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { AuthType } from 'src/model/commonModel'

export type LayoutValuesType = {
  layoutDisplay: boolean
  setLayoutDisplay: (layoutDisplay: boolean) => void

  companyNo: number
  setCompanyNo: (companyNo: number) => void
  companyId: string
  setCompanyId: (companyId: string) => void
  companyName: string
  setCompanyName: (companyName: string) => void
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
  setCompanyName: () => null
}

const LayoutContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const LayoutProvider = ({ children }: Props) => {
  const { user } = useAuth()

  useEffect(() => {
    if (user?.userInfo?.authId === AuthType.ADMIN) {
      setLayoutDisplay(true)
    } else {
      setLayoutDisplay(false)
    }

    if (user?.userInfo?.companyId) {
      setCompanyId(user?.userInfo?.companyId)
    }

    if (user?.userInfo?.companyName) {
      setCompanyName(user?.userInfo?.companyName)
    }

    if (user?.userInfo?.companyNo) {
      setCompanyNo(user?.userInfo?.companyNo)
    }
  }, [user?.userInfo])

  const [layoutDisplay, setLayoutDisplay] = useState(defaultProvider.layoutDisplay)
  const [companyId, setCompanyId] = useState(user?.userInfo?.companyId ?? defaultProvider.companyId)
  const [companyName, setCompanyName] = useState(user?.userInfo?.companyName ?? defaultProvider.companyName)
  const [companyNo, setCompanyNo] = useState(user?.userInfo?.companyNo ?? defaultProvider.companyNo)

  const handleSetLayoutDisplay = useCallback(
    (value: boolean) => {
      if (user?.userInfo?.authId === AuthType.ADMIN) {
        setLayoutDisplay(value)
      } else {
        setLayoutDisplay(false)
      }
    },
    [user?.userInfo?.authId]
  )

  const values: LayoutValuesType = {
    layoutDisplay,
    setLayoutDisplay: handleSetLayoutDisplay,
    companyNo,
    setCompanyNo,
    companyId,
    setCompanyId,
    companyName,
    setCompanyName
  }

  return <LayoutContext.Provider value={values}>{children}</LayoutContext.Provider>
}

export { LayoutContext, LayoutProvider }
