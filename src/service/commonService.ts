import { useMutation } from 'react-query'
import { EPath, EResultCode, ROLE, YN } from 'src/enum/commonEnum'
import MResult, { IComponents, MAuthInfo, MChangePassword, MUserInfo, MVerifyCodeReq } from 'src/model/commonModel'
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
export const useComponentListInfo = () => {
  const exampleComponent: IComponents = {
    componentId: 1,
    componentName: 'Dashboard',
    componentUri: '/dashboard',
    componentIconClass: 'icon-dashboard',
    subComponents: [
      {
        componentId: 101,
        componentName: 'Overview',
        componentUri: '/dashboard/overview',
        componentIconClass: 'icon-overview'
      },
      {
        componentId: 102,
        componentName: 'Stats',
        componentUri: '/dashboard/stats',
        componentIconClass: 'icon-stats'
      }
    ]
  }

  return useMutation(() => {
    // return API.get<IComponents[]>(EPath.COMPONENT_LIST, {})
    return Promise.resolve({ data: [exampleComponent] })
  }, {})
}

export const useUserDetailInfo = () => {
  const exampleUserInfo: MUserInfo = {
    id: 'user123',
    name: '홍길동',
    mobile: '010-1234-5678',
    status: 1,
    role: ROLE.ADMIN, // ROLE 타입에 맞는 값으로 대체해야 합니다.
    group: {
      id: 1,
      dataStatus: YN.Y,
      name: '',
      description: '',
      users: 1
    }, // MUserGroup 타입에 맞는 값으로 대체해야 합니다.
    email: 'honggildong@example.com'
  }

  return useMutation(() => {
    // return API.get<MUserInfo>(EPath.USER_DETAIL, {})
    return Promise.resolve({ data: exampleUserInfo })
  }, {})
}

export const useSaveLog = () => {
  return useMutation((message: string) => {
    return createGet<MResult>([EPath.LOG, { message: message }])
  }, {})
}
