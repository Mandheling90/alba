import { useMutation } from 'react-query'
import { EPath, EResultCode } from 'src/enum/commonEnum'
import MResult, {
  MAuthInfo,
  MChangePassword,
  MUserInfo,
  MVerifyCodeReq,
  MVerticalNavItems
} from 'src/model/commonModel'
import API from 'src/module/api'
import { createGet, createPatch } from 'src/module/reactQuery'

export const login = (loginId: string, password: string): Promise<MResult<MAuthInfo>> => {
  return new Promise<MResult<MAuthInfo>>(async (resolve, reject) => {
    try {
      const response: MResult<MAuthInfo> = await API.post(EPath.COMMON_LOGIN, {
        id: loginId,
        password
      })

      resolve(response)
    } catch (error) {
      console.log(error)
      const errorResult = error as MResult
      resolve({
        code: EResultCode.FAIL,
        isCommonError: errorResult.isCommonError,
        msg: errorResult.msg
      })
    }
  })
}

//비밀번호 변경 이메일 인증코드 요청
export const useGenerateCode = () => {
  return useMutation((email: string) => {
    return createGet<MResult>([EPath.GENERATE_CODE, { email: email }])
  }, {})
}

//이메일 인증코드 인증
export const useVerifyCode = () => {
  return useMutation((params: MVerifyCodeReq) => {
    return createGet<MResult>([EPath.VERIFY_CODE, { ...params }])
  }, {})
}

//비밀번호 변경
export const useChangePassword = () => {
  return useMutation((params: MChangePassword) => {
    return createPatch<MResult>([EPath.CHANGE_PASSWORD, params])
  }, {})
}

//메뉴 리스트 조회
export const useMenuList = () => {
  return useMutation(() => {
    return createGet<MVerticalNavItems[]>([EPath.MENU_LIST, {}])
  }, {})
}

export const useUserDetailInfo = () => {
  return useMutation(() => {
    return createGet<MUserInfo>([EPath.USER_INFO, {}])
  }, {})
}

export const useSaveLog = () => {
  return useMutation((message: string) => {
    return createGet<MResult>([EPath.LOG, { message: message }])
  }, {})
}
