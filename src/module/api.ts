import axios, { AxiosResponseHeaders, HttpStatusCode, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from 'axios'
import get from 'lodash/get'
import { EApiResultCode, EErrorMessage, ELocalStorageKey, EResultCode } from 'src/enum/commonEnum'
import MResult from 'src/model/commonModel'

export interface AxiosResponseCustom<T = any, D = any> {
  data: T
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: InternalAxiosRequestConfig<D>
  request?: any
  code?: EResultCode
  msg?: string
  result?: {
    code: string
    msg: string
    data?: T
    isCommonError?: boolean
    isAlert?: boolean
    serverErrorCode?: string
  }
}

const defaultConfig = {
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
  timeout: 10000,
  withCredentials: true
}

export const setAccessToken = async (newToken: string) => {
  await localStorage.setItem(ELocalStorageKey.ACCESS_TOKEN, newToken)
}

export const getAccessToken = async () => {
  return await localStorage.getItem(ELocalStorageKey.ACCESS_TOKEN)
}

export const setRefreshToken = async (newToken: string) => {
  await localStorage.setItem(ELocalStorageKey.REFRESH_TOKEN, newToken)
}

export const getRefreshToken = async () => {
  return await localStorage.getItem(ELocalStorageKey.REFRESH_TOKEN)
}

const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.')
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/auth/refresh`, {
      refreshToken
    })

    const newAccessToken = response.data.data.accessToken
    await setAccessToken(newAccessToken)

    return newAccessToken
  } catch (error) {
    // 리프레시 토큰도 만료된 경우 로그아웃 처리
    localStorage.removeItem(ELocalStorageKey.ACCESS_TOKEN)
    localStorage.removeItem(ELocalStorageKey.REFRESH_TOKEN)
    window.location.href = '/login'
    throw error
  }
}

const API = axios.create({ ...defaultConfig })

// API.defaults.headers.common['Content-Type'] = 'application/json'

API.interceptors.request.use(
  async (config: any) => {
    try {
      const accessToken = await getAccessToken()
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }

      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data'
      } else {
        config.headers['Content-Type'] = 'application/json'
      }

      if (config.url === 'login') {
        localStorage.setItem('LOGIN_TOKEN', accessToken ?? 'NONE')
      }

      return config
    } catch (e) {
      console.log(e)
    }
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

API.interceptors.response.use(
  (response: AxiosResponseCustom) => {
    const serverStatus = get(response, 'data.code', EApiResultCode.NONE)

    if (serverStatus !== EApiResultCode.SUCCESS) {
      const message = `${response?.data?.code}`
      console.log(`error: ${message}`)

      const result: MResult = {
        code: EResultCode.FAIL,
        msg: message
      }
      throw result
    }

    return {
      ...response,
      code: EResultCode.SUCCESS,
      msg: get(response, 'data.msg', '') ?? '',
      data: get(response, 'data.data', undefined)
    }
  },
  async (error: any) => {
    if (error.response && error.response.status) {
      console.log(JSON.stringify(error.response))

      let msg = error.response.data.msg
      let isAlert = false

      switch (error.response.status) {
        case HttpStatusCode.BadRequest:
          console.log('HttpStatusCode.BadRequest')
          msg = get(error.response, 'data.msg', EErrorMessage.LOGIN_FALL)
          break
        case HttpStatusCode.Unauthorized:
          console.log('HttpStatusCode.Unauthorized')
          try {
            const newAccessToken = await refreshAccessToken()
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`

            return axios(error.config)
          } catch (refreshError) {
            msg = '인증이 만료되었습니다. 다시 로그인해주세요.'
            break
          }
        case HttpStatusCode.Forbidden:
          isAlert = true
          console.log('HttpStatusCode.Forbidden')
          break

        case HttpStatusCode.NotFound:
          console.log('HttpStatusCode.NotFound')
          break
        case HttpStatusCode.RequestTimeout:
          console.log('HttpStatusCode.RequestTimeout')
          break

        //server side error
        case HttpStatusCode.InternalServerError:
          console.log('HttpStatusCode.InternalServerError')
          msg = '요청한 서비스가 정상적으로 처리되지 않았습니다.'
          break
        case HttpStatusCode.BadGateway:
          console.log('HttpStatusCode.BadGateway')
          break
        case HttpStatusCode.ServiceUnavailable:
          console.log('HttpStatusCode.ServiceUnavailable')
          break
        default:
          console.log(`default error:`, error.response.state)
      }

      const serverErrorCode = get(error.response, 'data.code', EApiResultCode.NONE)

      const result: MResult = {
        code: EResultCode.FAIL,
        msg: msg,
        isCommonError: true,
        isAlert: isAlert,
        serverErrorCode
      }

      throw result
    } else {
      //서버 응답 없을 경우
      console.log('Response None', error ? JSON.stringify(error) : 'NONE')

      const result: MResult = {
        code: EResultCode.FAIL,
        isCommonError: true,
        msg: '네트워크 또는 서버와의 연결이 원활하지 않습니다.'
      }
      throw result
    }
  }
)

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

const resetTokenAndReattemptRequest = async (error: any) => {
  try {
    if (!isRefreshing) {
      isRefreshing = true

      // 액세스 토큰을 리프레시하고 새로운 액세스 토큰을 얻어옵니다.
      // const newAccessToken = await refreshAccessToken()
      isRefreshing = false

      // 리프레시된 토큰을 사용하여 이전 요청을 다시 시도합니다.
      // error.config.headers['jwt-access-token'] = `Bearer ${newAccessToken}`

      return axios(error.config)
    } else {
      // 이미 리프레시 중인 경우, 대기 중인 리프레시 프로미스를 반환합니다.
      if (!refreshPromise) {
        refreshPromise = new Promise<string>(resolve => {
          setTimeout(() => {
            refreshPromise = null

            // resolve(getAccessToken() || '')
          }, 1000)
        })
      }
      const newAccessToken = await refreshPromise

      // 리프레시된 토큰을 사용하여 이전 요청을 다시 시도합니다.
      error.config.headers['Authorization'] = `Bearer ${newAccessToken}`

      return axios(error.config)
    }
  } catch (refreshError) {
    // 리프레시가 실패한 경우, 로그인 페이지로 리디렉션 또는 다른 조치를 취하세요.
    console.error('Refresh token failed', refreshError)

    // 예: 로그아웃 또는 로그인 페이지로 리디렉션
    // 여기에서 필요한 로직을 추가하세요.
    throw refreshError
  }
}

export default API
