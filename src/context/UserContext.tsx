import { ReactNode, createContext, useState } from 'react'
import { MUserGroup } from 'src/model/userSetting/userSettingModel'

export type UserValuesType = {
  layoutDisplay: boolean
  setLayoutDisplay: (layoutDisplay: boolean) => void
  userGroupInfo: MUserGroup[]
  setUserGroupInfo: (value: MUserGroup[]) => void
  clear: () => void
}

// ** Defaults
const defaultProvider: UserValuesType = {
  layoutDisplay: true,
  setLayoutDisplay: () => null,
  userGroupInfo: [],
  setUserGroupInfo: () => null,
  clear: () => null
}

const UserContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const UserProvider = ({ children }: Props) => {
  const [layoutDisplay, setLayoutDisplay] = useState(defaultProvider.layoutDisplay)
  const [userGroupInfo, setUserGroupInfo] = useState<MUserGroup[]>(defaultProvider.userGroupInfo)

  const clear = () => {
    setLayoutDisplay(defaultProvider.layoutDisplay)
    setUserGroupInfo(defaultProvider.userGroupInfo)
  }

  const values: UserValuesType = {
    layoutDisplay,
    setLayoutDisplay,
    userGroupInfo,
    setUserGroupInfo,
    clear
  }

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }
