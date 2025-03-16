import { ROLE, SORT } from 'src/enum/commonEnum'
import { MUserGroup } from './userSetting/userSettingModel'

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
  token: string
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
  id: string
  name: string
  mobile: string
  status: number
  role: ROLE
  group: MUserGroup
  email: string
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

export interface MOrder {
  sort: SORT
}
