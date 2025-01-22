import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/userSettingEnum'

import MResult from 'src/model/commonModel'
import {
  MRoleList,
  MUserArrDelete,
  MUserGroup,
  MUserMod,
  MUserSave,
  UserListAll
} from 'src/model/userSetting/userSettingModel'
import API from 'src/module/api'
import { createDelete, createGet, createPatch, createPost } from 'src/module/reactQuery'

export const useUserGroupList = () => {
  return useQuery<MResult<MUserGroup[]>>([EPath.USER_GROUP], {})
}

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

export const useUserGroupDel = () => {
  return useMutation((params: { groupId: number }) => {
    return API.delete<MResult>(EPath.USER_GROUP + `/${params.groupId}`, {})
  }, {})
}

export const useUserSave = () => {
  return useMutation((params: MUserSave) => {
    return createPost<MResult>([EPath.USER, params])
  }, {})
}
export const useUserMod = () => {
  return useMutation((params: MUserMod) => {
    return createPatch<MResult>([EPath.USER, params])
  }, {})
}
export const useUserAll = () => {
  return useQuery<MResult<UserListAll[]>>([EPath.USER_ALL], {})
}

export const useUserArrDel = () => {
  return useMutation((params: MUserArrDelete) => {
    return createDelete<MResult>([EPath.USER, params])
  }, {})
}

// export const useUserStatusSet = () => {
//   return useMutation((params: MUserStatus) => {
//     return API.post<MResult>(EPath.USER_STATUS, { ...params })
//   }, {})
// }
