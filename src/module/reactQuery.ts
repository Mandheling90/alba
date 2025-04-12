import { uniqueId } from 'lodash'
import { QueryCache, QueryClient, QueryObserverOptions } from 'react-query'
import API, { AxiosResponseCustom } from './api'

const defaultConfig: QueryObserverOptions<unknown, unknown> = {
  refetchOnWindowFocus: false,
  retry: 0,
  refetchIntervalInBackground: false,
  refetchInterval: false,
  suspense: true,
  useErrorBoundary: true
}

const errorCount: string[] = []

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultConfig,
      queryFn: ({ queryKey }) => {
        const [url, param] = queryKey as [string, any]

        return API.get(url, { params: param })
      }
    }
  },
  queryCache: new QueryCache({
    onError: async (error: any, query) => {
      if (errorCount.length === 0) {
        const id = uniqueId('error-id-')
        errorCount.push(id)
      }
    }
  })
})

// Mutation functions
export const createGet = async <T>(queryKey: any): Promise<AxiosResponseCustom<T>> => {
  const [url, param] = queryKey as [string, any]

  const res: AxiosResponseCustom<T> = await API.get(url, {
    params: param ?? {},
    paramsSerializer: params => {
      const searchParams = new URLSearchParams()

      Object.keys(params).forEach(key => {
        const value = params[key]
        if (Array.isArray(value)) {
          value.forEach(val => searchParams.append(key, val))
        } else {
          searchParams.append(key, value)
        }
      })

      return searchParams.toString()
    }
  })

  return res
}

export const createPost = async <T>(queryKey: any): Promise<AxiosResponseCustom<T>> => {
  try {
    const [url, param] = queryKey as [string, any]
    const res: AxiosResponseCustom<T> = await API.post(url, param ?? {})

    return res
  } catch (err: any) {
    err.isAlert && alert(err.msg)
    throw err
  }
}

export const createPut = async <T>(queryKey: any): Promise<AxiosResponseCustom<T>> => {
  try {
    const [url, param] = queryKey as [string, any]
    const res: AxiosResponseCustom<T> = await API.put(url, param ?? {})

    return res
  } catch (err: any) {
    err.isAlert && alert(err.msg)
    throw err
  }
}

export const createDelete = async <T>(queryKey: any): Promise<AxiosResponseCustom<T>> => {
  try {
    const [url, param] = queryKey as [string, any]

    const config = { data: param }

    const res: AxiosResponseCustom<T> = await API.delete(url, config)

    return res
  } catch (err: any) {
    err.isAlert && alert(err.msg)
    throw err
  }
}

export const createPatch = async <T>(queryKey: any): Promise<AxiosResponseCustom<T>> => {
  try {
    const [url, param] = queryKey as [string, any]

    const res: AxiosResponseCustom<T> = await API.patch(url, param)

    return res
  } catch (err: any) {
    err.isAlert && alert(err.msg)
    throw err
  }
}

export const createformData = async <T>(param: any): Promise<FormData> => {
  const formData = new FormData()
  const dto: Record<string, any> = {}

  if (param && typeof param === 'object') {
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        if (param[key] instanceof File || param[key] instanceof Blob) {
          formData.append('file', param[key])
        } else {
          dto[key] = param[key]
        }
      }
    }
  }

  formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

  return formData
}

export const createFilePatch = async <T>(queryKey: any): Promise<AxiosResponseCustom<T>> => {
  try {
    const [url, param] = queryKey as [string, any]

    const formData = await createformData(param)

    const res: AxiosResponseCustom<T> = await API.patch(url, formData, { timeout: 1800000 })

    return res
  } catch (err: any) {
    err.isAlert && alert(err.msg)
    throw err
  }
}

export const createFilePost = async <T>(queryKey: any): Promise<AxiosResponseCustom<T>> => {
  try {
    const [url, param] = queryKey as [string, any]

    const formData = await createformData(param)

    const res: AxiosResponseCustom<T> = await API.post(url, formData, { timeout: 1800000 })

    return res
  } catch (err: any) {
    err.isAlert && alert(err.msg)
    throw err
  }
}
