import { ReactNode, createContext, useCallback, useEffect, useState } from 'react'
import { EErrorMessage, EResultCode, SORT } from 'src/enum/commonEnum'
import { MContent, MContentReq } from 'src/model/contents/contentsModel'
import { useContentsInsert, useContentsUpdate } from 'src/service/contents/contentsService'
import { validateFields } from 'src/utils/CommonUtil'
import { ErrCallbackType } from './types'

export type ContentsValuesType = {
  isContentsManagerModalOpen: boolean
  setIsContentsManagerModalOpen: (isContentsManagerModalOpen: boolean) => void

  contentListReqPram: MContentReq
  setContentListReqPram: (contentListReqPram: MContentReq) => void

  loading: boolean
  setLoading: (value: boolean) => void

  errors: Partial<Record<keyof MContent, string>>
  setErrors: (errors: Partial<Record<keyof MContent, string>>) => void

  selectedContent: Partial<MContent>
  setSelectedContent: (selectedContent: Partial<MContent>) => void

  selectedContentIds: number[]
  setSelectedContentIds: (selectedContentIds: number[]) => void

  contentsUpsert: (params: Partial<MContent>, isAdd: boolean, errorCallback?: ErrCallbackType) => void
}

// ** Defaults
const defaultProvider: ContentsValuesType = {
  isContentsManagerModalOpen: false,
  setIsContentsManagerModalOpen: () => null,

  contentListReqPram: { sort: 'startDate', order: SORT.DESC },
  setContentListReqPram: () => null,

  loading: true,
  setLoading: () => Boolean,

  errors: {},
  setErrors: () => null,

  selectedContent: {},
  setSelectedContent: () => null,

  selectedContentIds: [],
  setSelectedContentIds: () => null,

  contentsUpsert: () => Promise.resolve()
}

const ContentsContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const ContentsProvider = ({ children }: Props) => {
  // ** States
  const [isContentsManagerModalOpen, setIsContentsManagerModalOpen] = useState(
    defaultProvider.isContentsManagerModalOpen
  )
  const [selectedContent, setSelectedContent] = useState<Partial<MContent>>(defaultProvider.selectedContent)
  const [contentListReqPram, setContentListReqPram] = useState<MContentReq>(defaultProvider.contentListReqPram)
  const [selectedContentIds, setSelectedContentIds] = useState(defaultProvider.selectedContentIds)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [errors, setErrors] = useState<Partial<Record<keyof MContent, string>>>({})

  const { mutateAsync: contentsInsert } = useContentsInsert()
  const { mutateAsync: contentsUpdate } = useContentsUpdate()

  const consoleDenied = useCallback((): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const ENV_MODE: string = process.env.NEXT_PUBLIC_ENV_MODE as string

      try {
        if (ENV_MODE === 'production') {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          const noop = () => {}
          const originalConsole = { ...window.console } // 기존 콘솔을 복사

          window.console = {
            ...originalConsole, // 기존 메서드 유지
            log: noop,
            info: noop,
            debug: noop,
            error: noop,
            warn: noop
          }
        }
      } finally {
        resolve(true)
      }
    })
  }, [])

  const contentsUpsert = async (params: Partial<MContent>, isAdd: boolean, errorCallback?: ErrCallbackType) => {
    try {
      const res = await validateFields(params, [
        'contentsTypeId',
        'name',
        'type',
        'priorityType',
        'postStartDate',
        'postEndDate',
        'expireType'
      ])

      if (!res.result) {
        throw new Error('필수값을 입력해주세요') // 예외 던지기
      }

      const result = isAdd ? await contentsInsert(params) : await contentsUpdate(params)

      if (result.code === EResultCode.FAIL) {
        throw new Error(result.msg || EErrorMessage.COMMON_ERROR) // 예외 던지기
      }
    } catch (error) {
      errorCallback?.({
        type: 'error',
        message: (error as Error).message ?? (error as any).msg
      })
      throw error // 예외 던지기
    }
  }

  const values = {
    isContentsManagerModalOpen,
    setIsContentsManagerModalOpen,
    contentListReqPram,
    setContentListReqPram,
    loading,
    setLoading,
    errors,
    setErrors,
    selectedContent,
    setSelectedContent,
    selectedContentIds,
    setSelectedContentIds,
    contentsUpsert
  }

  useEffect(() => {
    consoleDenied()
  }, [])

  return <ContentsContext.Provider value={values}>{children}</ContentsContext.Provider>
}

export { ContentsContext, ContentsProvider }
