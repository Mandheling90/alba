import { ReactNode, createContext, useState } from 'react'
import { CRUD } from 'src/enum/commonEnum'
import {
  MAuthList,
  MAuthMenuList,
  MAuthcolumnList,
  MUserCompanyList,
  MUserGroup
} from 'src/model/userSetting/userSettingModel'

export type UserValuesType = {
  companyNo: number
  setCompanyNo: (companyNo: number) => void

  layoutDisplay: boolean
  setLayoutDisplay: (layoutDisplay: boolean) => void
  userGroupInfo: MUserGroup[]
  setUserGroupInfo: (value: MUserGroup[]) => void

  userCompanyList: MUserCompanyList[]
  setUserCompanyList: (value: MUserCompanyList[]) => void

  authList: MAuthList[]
  setAuthList: (value: MAuthList[]) => void

  authMenuList: MAuthMenuList[]
  setAuthMenuList: (value: MAuthMenuList[]) => void

  selectedUser: MUserCompanyList[]
  setSelectedUser: (value: MUserCompanyList[]) => void

  selectedAuthList: MAuthList
  setSelectedAuthList: (value: MAuthList) => void

  selectedAuthcolumnList: MAuthcolumnList[]
  setSelectedAuthcolumnList: (value: MAuthcolumnList[]) => void

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
  selectedAuthList: { authId: 0, name: '', userAuthCount: 0, type: CRUD.R },
  setSelectedAuthList: () => null,

  userCompanyList: [],
  setUserCompanyList: () => null,

  authList: [],
  setAuthList: () => null,

  authMenuList: [],
  setAuthMenuList: () => null,

  selectedAuthcolumnList: [],
  setSelectedAuthcolumnList: () => null,

  selectedUser: [],
  setSelectedUser: () => null,

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
  const [selectedAuthList, setSelectedAuthList] = useState<MAuthList>(defaultProvider.selectedAuthList)
  const [authList, setAuthList] = useState<MAuthList[]>(defaultProvider.authList)
  const [authMenuList, setAuthMenuList] = useState<MAuthMenuList[]>(defaultProvider.authMenuList)
  const [userCompanyList, setUserCompanyList] = useState<MUserCompanyList[]>(defaultProvider.userCompanyList)
  const [selectedUser, setSelectedUser] = useState<MUserCompanyList[]>(defaultProvider.selectedUser)
  const [selectedAuthcolumnList, setSelectedAuthcolumnList] = useState<MAuthcolumnList[]>(
    defaultProvider.selectedAuthcolumnList
  )

  const clear = () => {
    setLayoutDisplay(defaultProvider.layoutDisplay)
    setUserGroupInfo(defaultProvider.userGroupInfo)
    setSelectedAuthList(defaultProvider.selectedAuthList)
    setAuthList(defaultProvider.authList)
    setAuthMenuList(defaultProvider.authMenuList)
    setSelectedAuthcolumnList(defaultProvider.selectedAuthcolumnList)
    setUserCompanyList(defaultProvider.userCompanyList)
    setSelectedUser(defaultProvider.selectedUser)
  }

  const values: UserValuesType = {
    companyNo,
    setCompanyNo,
    layoutDisplay,
    setLayoutDisplay,
    userGroupInfo,
    setUserGroupInfo,
    selectedAuthList,
    setSelectedAuthList,
    userCompanyList,
    setUserCompanyList,
    authList,
    setAuthList,
    authMenuList,
    setAuthMenuList,
    selectedAuthcolumnList,
    setSelectedAuthcolumnList,
    selectedUser,
    setSelectedUser,
    clear
  }

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }
