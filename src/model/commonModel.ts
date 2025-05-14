import { SORT, YN } from 'src/enum/commonEnum'

export enum AuthType {
  CUSTOMER = 1,
  ADMIN = 2
}

export default interface MResult<T = any> {
  code?: string
  msg: string
  data?: T
  isCommonError?: boolean
  isAlert?: boolean
  serverErrorCode?: string
}

export interface MData {
  data?: string
}

export interface MCommonResult {
  code: string
  msg: string
  data?: string
}

export interface MAuthInfo {
  accessToken: string
  refreshToken?: string
}

export interface MPasswordChangePram {
  email: string
  userId: number
}

export interface MVerifyCode {
  email: string
}

export interface MComponentListInfo {
  components: IComponents[]
}

export interface MUserInfo {
  userNo: number
  userId: string
  name: string
  mobileNo: string
  mailAddress: string
  authId: AuthType
  authName: string
  userStatus: number
  userStatusStr: string
  companyNo: number
  companyId: string
  companyName: string
  authMenuList: MAuthMenuList[]
}

export interface MAuthMenuList {
  menuId: number
  createYn: YN
  updateYn: YN
  readYn: YN
  deleteYn: YN
}

export interface MVerifyCodeReq {
  code: string
  email: string
}

export interface MChangePassword {
  email: string
  newPassword: string
}

export interface IComponents {
  componentId: number
  componentName: string
  componentUri: string
  componentIconClass: string
  subComponents: MSubComponents[]
}

interface MSubComponents {
  componentId: number
  componentName: string
  componentUri: string
  componentIconClass: string
}

export interface MVerticalNavItems {
  title: string
  icon: string
  path: string
  children: MVerticalNavItems[]
}

export interface MHorizontalNavItems {
  title: string
  icon: string
  path: string
}

export interface MOrder {
  sort: SORT
}

export interface MAuthDuplicate {
  authName: string
  duplicateYn: YN
  message: string
}
