// ** React Imports
import { ReactNode, createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config

// ** Types
import { EErrorMessage, ELocalStorageKey, EResultCode, ROLE } from 'src/enum/commonEnum'
import { login, useGenerateCode, useMenuList, useUserDetailInfo } from 'src/service/commonService'
import { useUserGroup } from 'src/service/setting/userSetting'
import { AuthValuesType, ErrCallbackType, LoginParams, SuccessCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  generateCode: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const { mutateAsync: menuListMutate } = useMenuList()
  const { mutateAsync: userDetailInfoMutate } = useUserDetailInfo()
  const { mutateAsync: groupMutate } = useUserGroup()
  const { mutateAsync: generateCodeMutate, isLoading } = useGenerateCode()

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      if (!user?.componentListInfo) {
        if (router.pathname.includes('login')) {
          handleLogout()

          return
        }

        try {
          const result = await menuListMutate()
          const userInfo = await userDetailInfoMutate()

          if (result.data && userInfo.data) {
            console.log(userInfo.data)

            setUser({
              ...user,
              componentListInfo: result.data,
              userInfo: userInfo.data,
              role: ROLE.ADMIN,
              viewNamesWithY: []
            })

            setLoading(false)
          } else {
            handleLogout()
          }
        } catch {
          handleLogout()
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    try {
      const result = await login(params.id, params.password ?? '')

      if (result.code === EResultCode.FAIL) {
        errorCallback?.({
          type: 'manual',
          message: result.msg
        })

        return
      }

      window.localStorage.setItem(ELocalStorageKey.ACCESS_TOKEN, result.data?.accessToken ?? '')
      window.localStorage.setItem(ELocalStorageKey.REFRESH_TOKEN, result.data?.refreshToken ?? '')

      const menuList = await menuListMutate()
      const userInfo = await userDetailInfoMutate()

      if (result.code !== EResultCode.FAIL) {
        if (params.rememberMe) {
          window.localStorage.setItem(ELocalStorageKey.LGOIN_REMEMBER, params.id)
        } else {
          window.localStorage.removeItem(ELocalStorageKey.LGOIN_REMEMBER)
        }

        setUser({
          ...user,
          userInfo: userInfo.data,
          role: ROLE.ADMIN,
          viewNamesWithY: [],
          componentListInfo: menuList.data
        })

        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
        setLoading(false)
      } else {
        if (errorCallback) {
          errorCallback({
            type: 'manual',
            message: result.code === EResultCode.FAIL ? result.msg : ''
          })
        }
      }
    } catch (error) {
      console.log(error)

      if (errorCallback) {
        errorCallback({
          type: 'manual',
          message: '로그인 오류가 발생했습니다.'
        })
      }
    }
  }

  const handleGenerateCode = async (
    email: string,
    errorCallback?: ErrCallbackType,
    successCallback?: SuccessCallbackType
  ) => {
    try {
      const result = await generateCodeMutate(email)

      if (result.code === EResultCode.SUCCESS) {
        successCallback?.()
      } else {
        if (errorCallback) {
          errorCallback({
            type: 'manual',
            message: result.msg ?? EErrorMessage.COMMON_ERROR
          })
        }
      }
    } catch (error: any) {
      console.log(error)
      errorCallback?.({
        type: 'manual',
        message: error?.msg
      })
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(ELocalStorageKey.ACCESS_TOKEN)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    generateCode: handleGenerateCode
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
