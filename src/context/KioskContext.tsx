import { ReactNode, createContext, useState } from 'react'
import { EErrorMessage, EResultCode, YN } from 'src/enum/commonEnum'
import { MContent } from 'src/model/contents/contentsModel'
import { KioskListReq, MKiosk, MKioskCardSlider, MKioskContent, MKioskUpdateReq } from 'src/model/kiosk/kioskModel'
import {
  useKioskContentsDelete,
  useKioskContentsUpdate,
  useKioskDelete,
  useKioskInsert,
  useKioskUpdate
} from 'src/service/kiosk/kioskService'
import { validateFields } from 'src/utils/CommonUtil'
import { ErrCallbackType } from './types'

export type KioskValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void

  errors: Partial<Record<keyof MContent, string>>
  setErrors: (errors: Partial<Record<keyof MContent, string>>) => void

  checkedKioskIds: number[]
  setCheckedKioskIds: (checkedKioskIds: number[]) => void

  selectedKioskInfo: Partial<MKiosk>
  setSelectedKioskInfo: (selectedKioskInfo: Partial<MKiosk>) => void

  kioskContentModRows: Partial<MKioskContent[]>
  setKioskContentModRows: (kioskContentModRows: Partial<MKioskContent[]>) => void
  kioskContentDeleteIds: number[]
  setKioskContentDeleteIds: (kioskContentDeleteIds: number[]) => void

  isKioskManagerModalOpen: boolean
  setIsKioskManagerModalOpen: (isKioskManagerModalOpen: boolean) => void

  kioskViewType: 'card' | 'list'
  setKioskViewType: (kioskViewType: 'card' | 'list') => void

  kioskListReq: KioskListReq
  setKioskListReq: (kioskListReq: KioskListReq) => void

  initialKioskList: MKiosk[]
  setInitialKioskList: (initialKioskList: MKiosk[]) => void

  kioskSort: { field: string; sort: 'asc' | 'desc' | null | undefined }
  setKioskSort: (kioskSort: { field: string; sort: 'asc' | 'desc' | null | undefined }) => void

  kioskCardSlider: MKioskCardSlider[]
  setKioskCardSlider: (kioskCardSlider: MKioskCardSlider[]) => void

  kioskUpsert: (params: Partial<MKioskUpdateReq>, isAdd: boolean, errorCallback?: ErrCallbackType) => void
  kioskContentUpdate: (kioskId: number, errorCallback?: ErrCallbackType) => void
  kioskDelete: (kioskId: number[], contentDeleteIds?: number[], errorCallback?: ErrCallbackType) => void
  kioskContentsDelete: (kioskId: number, contentDeleteIds?: number[], errorCallback?: ErrCallbackType) => void
}

// ** Defaults
const defaultProvider: KioskValuesType = {
  loading: true,
  setLoading: () => Boolean,

  errors: {},
  setErrors: () => null,

  checkedKioskIds: [],
  setCheckedKioskIds: () => null,

  selectedKioskInfo: {},
  setSelectedKioskInfo: () => null,

  kioskContentModRows: [],
  setKioskContentModRows: () => null,
  kioskContentDeleteIds: [],
  setKioskContentDeleteIds: () => null,

  isKioskManagerModalOpen: false,
  setIsKioskManagerModalOpen: () => null,

  kioskViewType: 'card',
  setKioskViewType: () => null,

  kioskListReq: {},
  setKioskListReq: () => null,

  initialKioskList: [],
  setInitialKioskList: () => null,

  kioskSort: { field: '', sort: null },
  setKioskSort: () => null,

  kioskCardSlider: [],
  setKioskCardSlider: () => null,

  kioskUpsert: () => Promise.resolve(),
  kioskContentUpdate: () => Promise.resolve(),
  kioskDelete: () => Promise.resolve(),
  kioskContentsDelete: () => Promise.resolve()
}

const KioskContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const KioskProvider = ({ children }: Props) => {
  const { mutateAsync: kioskUpdate } = useKioskUpdate()
  const { mutateAsync: kioskInsert } = useKioskInsert()
  const { mutateAsync: kioskContentsUpdate } = useKioskContentsUpdate()
  const { mutateAsync: kioskDeleteMutate } = useKioskDelete()
  const { mutateAsync: kioskContentsDeleteMutate } = useKioskContentsDelete()

  // ** States
  const [checkedKioskIds, setCheckedKioskIds] = useState(defaultProvider.checkedKioskIds)
  const [selectedKioskInfo, setSelectedKioskInfo] = useState(defaultProvider.selectedKioskInfo)
  const [kioskContentModRows, setKioskContentModRows] = useState(defaultProvider.kioskContentModRows)
  const [kioskContentDeleteIds, setKioskContentDeleteIds] = useState(defaultProvider.kioskContentDeleteIds)
  const [isKioskManagerModalOpen, setIsKioskManagerModalOpen] = useState(defaultProvider.isKioskManagerModalOpen)
  const [kioskViewType, setKioskViewType] = useState(defaultProvider.kioskViewType)
  const [kioskListReq, setKioskListReq] = useState(defaultProvider.kioskListReq)
  const [initialKioskList, setInitialKioskList] = useState(defaultProvider.initialKioskList)
  const [kioskSort, setKioskSort] = useState(defaultProvider.kioskSort)
  const [kioskCardSlider, setKioskCardSlider] = useState(defaultProvider.kioskCardSlider)

  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({})

  const kioskUpsert = async (params: Partial<MKioskUpdateReq>, isAdd: boolean, errorCallback?: ErrCallbackType) => {
    try {
      const res = await validateFields(params, ['name', 'location', 'kioskTypeId'])

      if (!res.result) {
        throw new Error('필수값을 입력해주세요') // 예외 던지기
      }

      const result = isAdd ? await kioskInsert(params) : await kioskUpdate(params)

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

  const kioskContentUpdate = async (kioskId: number, errorCallback?: ErrCallbackType) => {
    try {
      // const updateRow = kioskContentModRows.filter(item => item && !kioskContentDeleteIds.includes(item.contentsId))

      // console.log(kioskContentDeleteIds)

      const updatePromises = kioskContentModRows.map(async item => {
        if (item) {
          const result = await kioskContentsUpdate({
            id: item.id,
            contentsId: item.contentsId,
            forceUpdated: item.forceUpdated,
            dataStatus: kioskContentDeleteIds.includes(item.contentsId) ? YN.D : item.dataStatus,
            startTime: item.startTime,
            endTime: item.endTime
          })
          if (result.code === EResultCode.FAIL) {
            throw new Error(result.msg || EErrorMessage.COMMON_ERROR)
          }
        }
      })

      await Promise.all(updatePromises) // 병렬 처리
    } catch (error) {
      errorCallback?.({
        type: 'error',
        message: (error as Error).message ?? (error as any).msg
      })
      throw error
    }
  }
  const kioskDelete = async (kioskId: number[], contentDeleteIds?: number[], errorCallback?: ErrCallbackType) => {
    try {
      const req = kioskId.map(item => {
        return { id: item, kioskContentsIdList: contentDeleteIds ?? [] }
      })

      const result = await kioskDeleteMutate(req)

      if (result.code === EResultCode.FAIL) {
        throw new Error(result.msg || EErrorMessage.COMMON_ERROR)
      }
    } catch (error) {
      errorCallback?.({
        type: 'error',
        message: (error as Error).message ?? (error as any).msg
      })
      throw error // 예외 던지기
    }
  }

  const kioskContentsDelete = async (kioskId: number, contentDeleteIds?: number[], errorCallback?: ErrCallbackType) => {
    try {
      const result = await kioskContentsDeleteMutate({ id: kioskId, kioskContentsIdList: contentDeleteIds })

      if (result.code === EResultCode.FAIL) {
        throw new Error(result.msg || EErrorMessage.COMMON_ERROR)
      }
    } catch (error) {
      errorCallback?.({
        type: 'error',
        message: (error as Error).message ?? (error as any).msg
      })
      throw error // 예외 던지기
    }
  }
  const values: KioskValuesType = {
    loading,
    setLoading,
    errors,
    setErrors,
    checkedKioskIds: checkedKioskIds,
    setCheckedKioskIds: setCheckedKioskIds,
    selectedKioskInfo: selectedKioskInfo,
    setSelectedKioskInfo: setSelectedKioskInfo,
    kioskContentModRows: kioskContentModRows,
    setKioskContentModRows: setKioskContentModRows,
    kioskContentDeleteIds: kioskContentDeleteIds,
    setKioskContentDeleteIds: setKioskContentDeleteIds,
    isKioskManagerModalOpen: isKioskManagerModalOpen,
    setIsKioskManagerModalOpen: setIsKioskManagerModalOpen,
    kioskViewType: kioskViewType,
    setKioskViewType: setKioskViewType,
    kioskUpsert: kioskUpsert,
    kioskContentUpdate: kioskContentUpdate,
    kioskDelete: kioskDelete,
    kioskContentsDelete: kioskContentsDelete,
    kioskListReq: kioskListReq,
    setKioskListReq: setKioskListReq,
    initialKioskList: initialKioskList,
    setInitialKioskList: setInitialKioskList,

    kioskSort: kioskSort,
    kioskCardSlider: kioskCardSlider,
    setKioskCardSlider: setKioskCardSlider,
    setKioskSort: setKioskSort
  }

  return <KioskContext.Provider value={values}>{children}</KioskContext.Provider>
}

export { KioskContext, KioskProvider }
