import { YN,CRUD } from 'src/enum/commonEnum'

export interface MRole {
  menuId: number
  menuName?: string
  fullAccess?: YN
  createYn: YN
  updateYn: YN
  deleteYn: YN
  readYn: YN
}

export interface MRoleList {
  roleList: MRole[]
}

export interface MUserGroup {
  id: number
  dataStatus: YN
  name: string
  description?: string
  users?: number
}

export interface User {
  userId: number
  name: string
  groupId: number
  groupName: string
  email: string | null
  loginId: string
  mobile: string | null
  admStatus: number
  lastLoginDatetime: string | null
  display: boolean
}

export interface UserTable {
  id: number
  name: string
  loginId: string | null
  groupName: string
  groupId: number
  mobile: string | null
  admStatus: number
  display: boolean
}

export interface UserListResponse {
  totalCount: number
  resultCount: number
  data: User[]
}

export interface UserListAll {
  group: MUserGroup
  id: string
  mobile: string
  email: string
  name: string
  role: string
  status: number

  display?: boolean
}

export interface MUserStatus {
  id: string
  status: number
}
export interface MUserArrDelete {
  userNos: number[]
}

export interface MAuthList {
  authId: number
  name: string
  userAuthCount: number
  type:CRUD
}

export interface MAuthMenuList {
  menuId: number
  menuName: string
  createYn: YN
  updateYn: YN
  deleteYn: YN
  readYn: YN
}

export interface MAuthcolumnList {
  menuId: number
  menuName: string
  createYn: YN
  updateYn: YN
  deleteYn: YN
  readYn: YN
  data: MRole[]
}

export interface MAuthMenu {
  authId: number
  authName: string
  dataStatus: YN
  dataStatusStr: string
  roles: MRole[]
}

export interface MUserCompanyList {
  userNo: number
  userId: string
  name: string
  mobileNo: string | null
  mailAddress: string | null
  authId: number
  authName: string | null
  userStatus: number
  userStatusStr: string
}

export interface MAuthAdd {
  companyNo?: number
  authName: string
  authId?: number
  menuRoles?: MRole[]
  roles?: MRole[]
}
