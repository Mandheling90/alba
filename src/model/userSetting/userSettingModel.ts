import { YN } from 'src/enum/commonEnum'

export interface MRole {
  viewName?: string
  fullAccess: YN
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

export interface MUserSave {
  id: string
  name: string
  password: string
  mobile: string
  groupId: number
  status: number
}

export interface MUserMod {
  id: string
  name?: string
  password?: string
  mobile?: string
  groupId?: number
  status?: number
}

export interface MUserStatus {
  id: string
  status: number
}
export interface MUserArrDelete {
  idList: string[]
}
