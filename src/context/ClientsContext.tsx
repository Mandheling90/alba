import { ReactNode, createContext, useState } from 'react'
import { EErrorMessage, EResultCode } from 'src/enum/commonEnum'
import { MContent } from 'src/model/contents/contentsModel'
import { KioskListReq, MKiosk, MKioskCardSlider, MKioskContent, MKioskUpdateReq } from 'src/model/kiosk/kioskModel'
import { useKioskInsert, useKioskUpdate } from 'src/service/kiosk/kioskService'
import { validateFields } from 'src/utils/CommonUtil'
import { ErrCallbackType } from './types'

export type ClientsValuesType = {
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
}

// ** Defaults
const defaultProvider: ClientsValuesType = {
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

  kioskUpsert: () => Promise.resolve()
}

const ClientsContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const ClientsProvider = ({ children }: Props) => {
  const { mutateAsync: kioskUpdate } = useKioskUpdate()
  const { mutateAsync: kioskInsert } = useKioskInsert()

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

  const values: ClientsValuesType = {
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
    kioskListReq: kioskListReq,
    setKioskListReq: setKioskListReq,
    initialKioskList: initialKioskList,
    setInitialKioskList: setInitialKioskList,

    kioskSort: kioskSort,
    kioskCardSlider: kioskCardSlider,
    setKioskCardSlider: setKioskCardSlider,
    setKioskSort: setKioskSort
  }

  return <ClientsContext.Provider value={values}>{children}</ClientsContext.Provider>
}

export { ClientsContext, ClientsProvider }
