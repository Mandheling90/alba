import { IComponents, MUserInfo } from 'src/model/commonModel'

export type ErrCallbackType = (err: { [key: string]: string }) => void
export type SuccessCallbackType = () => void

export type LoginParams = {
  id: string
  password?: string
  name?: string
  rememberMe?: boolean
}

export type UserDataType = {
  loginId?: string
  userName?: string
  password?: string
  avatar?: string | null
  role?: string
  componentListInfo?: IComponents[]
  viewNamesWithY?: (string | undefined)[]

  id?: number
  fullName?: string
  username?: string
  email?: string
  userInfo?: MUserInfo
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  generateCode: (email: string, errorCallback?: ErrCallbackType, successCallback?: SuccessCallbackType) => void
}
