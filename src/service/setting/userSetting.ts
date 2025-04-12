import { useMutation, useQuery } from 'react-query'
import { YN } from 'src/enum/commonEnum'
import { EPath } from 'src/enum/userSettingEnum'

import MResult from 'src/model/commonModel'
import {
  MAuthAdd,
  MAuthDuplicate,
  MAuthList,
  MAuthMenu,
  MRoleList,
  MUserArrDelete,
  MUserCompanyList,
  MUserGroup
} from 'src/model/userSetting/userSettingModel'
import API from 'src/module/api'
import { createDelete, createGet, createPatch, createPost, createPut } from 'src/module/reactQuery'

export const useUserGroup = () => {
  return useMutation((params: { id: number }) => {
    return createGet<MUserGroup & MRoleList>([EPath.USER_GROUP + `/${params.id}`])
  }, {})
}

export const useUserGroupSave = () => {
  return useMutation((params: MUserGroup & MRoleList) => {
    return createPost<MResult>([EPath.USER_GROUP, params])
  }, {})
}
export const useUserGroupMod = () => {
  return useMutation((params: MUserGroup & MRoleList) => {
    return createPatch<MResult>([EPath.USER_GROUP, params])
  }, {})
}

export const useAuthDuplicate = () => {
  return useMutation((params: { authName: string; companyNo: number }) => {
    return createGet<MAuthDuplicate>([EPath.AUTH_DUPLICATE, params])
  }, {})
}

export const useUserGroupDel = () => {
  return useMutation((params: { groupId: number }) => {
    return API.delete<MResult>(EPath.USER_GROUP + `/${params.groupId}`, {})
  }, {})
}

export const useUserSave = () => {
  return useMutation((params: MUserCompanyList) => {
    return createPost<MResult>([EPath.USER, params])
  }, {})
}

export const useUserMod = () => {
  return useMutation((params: MUserCompanyList) => {
    return createPut<MResult>([EPath.USER, params])
  }, {})
}

export const useUserStateMod = () => {
  return useMutation((params: { userNo: number; userStatus: number }) => {
    return createPatch<MResult>([EPath.USER_STATUS, params])
  }, {})
}

export const useUserArrDel = () => {
  return useMutation((params: MUserArrDelete) => {
    return createDelete<MResult>([EPath.USER, params])
  }, {})
}

export const useAuthList = (params: { companyNo: number }) => {
  return useQuery<MResult<MAuthList[]>>([EPath.AUTH_LIST, params], {})
}

export const useAuthMenuList = (params: { authId: number }) => {
  return useQuery<MResult<MAuthMenu>>([EPath.AUTH + `/${params.authId}`], {})
}

export const useAddAuth = () => {
  return useMutation((params: MAuthAdd) => {
    return createPost<MResult>([EPath.AUTH, params])
  }, {})
}

export const useModAuth = () => {
  return useMutation((params: MAuthAdd) => {
    return createPut<MResult>([EPath.AUTH, params])
  }, {})
}

export const useDelAuth = () => {
  return useMutation((params: { authId: number }) => {
    return createDelete<MResult>([EPath.AUTH, params])
  }, {})
}

export const useUserCompanyList = (params: { companyNo: number }) => {
  return useQuery<MResult<MUserCompanyList[]>>([EPath.USER_COMPANY_LIST + `/${params.companyNo}`], {})
}

export const useAuthStatusMod = () => {
  return useMutation((params: { authId: number; dataStatus: YN }) => {
    return createPatch<MResult>([EPath.AUTH_STATUS, params])
  }, {})
}
