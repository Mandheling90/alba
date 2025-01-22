import { FC } from 'react'
import { MUserGroup } from 'src/model/userSetting/userSettingModel'
import { create } from 'zustand'
import UserSetting from './UserSetting'

interface MUserSettingStore {
  userGroupInfo: MUserGroup[]
}

interface MUserSettingAction {
  setUserGroupInfo: (value: MUserGroup[]) => void
}

export const defaultValue: MUserSettingStore = {
  userGroupInfo: []
}

export const useUserSettingStore = create<MUserSettingStore & MUserSettingAction>(set => ({
  ...defaultValue,
  setUserGroupInfo: (value: MUserGroup[]) =>
    set(state => {
      return {
        ...state,
        userGroupInfo: value
      }
    }),

  clear: () =>
    set(() => {
      return defaultValue
    })
}))

const Index: FC = ({}): React.ReactElement => {
  return <UserSetting />
}

export default Index
