import { ReactNode, createContext, useState } from 'react'
import { MUserGroup } from 'src/model/userSetting/userSettingModel'

export type UserValuesType = {
  companyNo: number
  setCompanyNo: (companyNo: number) => void

  layoutDisplay: boolean
  setLayoutDisplay: (layoutDisplay: boolean) => void
  userGroupInfo: MUserGroup[]
  setUserGroupInfo: (value: MUserGroup[]) => void
  selectedGroupId: number | null | 'new'
  setSelectedGroupId: (id: number | null | 'new') => void
  clear: () => void
}

// ** Defaults
const defaultProvider: UserValuesType = {
  companyNo: 39,
  setCompanyNo: () => null,

  layoutDisplay: true,
  setLayoutDisplay: () => null,
  userGroupInfo: [],
  setUserGroupInfo: () => null,
  selectedGroupId: null,
  setSelectedGroupId: () => null,
  clear: () => null
}

const UserContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const UserProvider = ({ children }: Props) => {
  const [companyNo, setCompanyNo] = useState(defaultProvider.companyNo)

  const [layoutDisplay, setLayoutDisplay] = useState(defaultProvider.layoutDisplay)
  const [userGroupInfo, setUserGroupInfo] = useState<MUserGroup[]>(defaultProvider.userGroupInfo)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null | 'new'>(defaultProvider.selectedGroupId)

  const clear = () => {
    setLayoutDisplay(defaultProvider.layoutDisplay)
    setUserGroupInfo(defaultProvider.userGroupInfo)
    setSelectedGroupId(defaultProvider.selectedGroupId)
  }

  const values: UserValuesType = {
    companyNo,
    setCompanyNo,
    layoutDisplay,
    setLayoutDisplay,
    userGroupInfo,
    setUserGroupInfo,
    selectedGroupId,
    setSelectedGroupId,
    clear
  }

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }
