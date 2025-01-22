import { ReactNode, createContext, useState } from 'react'
import { EErrorMessage, EResultCode } from 'src/enum/commonEnum'
import { MContent } from 'src/model/contents/contentsModel'
import { IPartListReq, MKioskPartTypeList, MKioskPartTypeReqTempData } from 'src/model/kiosk/kioskManagerModel'
import { useKioskPartInsert, useKioskPartTypeInsert, useKioskPartTypeUpdate } from 'src/service/kiosk/kioskManager'
import { validateFields } from 'src/utils/CommonUtil'
import { ErrCallbackType } from './types'

export type KioskManagerValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void

  errors: Partial<Record<keyof MContent, string>>
  setErrors: (errors: Partial<Record<keyof MContent, string>>) => void

  isKioskComponentModalOpen: boolean
  setIsKioskComponentModalOpen: (isKioskComponentModalOpen: boolean) => void

  selectKioskPartTypeList: Partial<MKioskPartTypeList & { selectIndex: number }>
  setSelectKioskPartTypeList: (selectKioskPartTypeList: Partial<MKioskPartTypeList & { selectIndex: number }>) => void

  kioskPartTypeReq: Partial<MKioskPartTypeReqTempData>
  setKioskPartTypeReq: (kioskPartTypeReq: Partial<MKioskPartTypeReqTempData>) => void

  kioskPartTypeInsertFn: (params: Partial<MKioskPartTypeReqTempData>, errorCallback?: ErrCallbackType) => void
  kioskPartTypeUpdateFn: (
    params: Partial<MKioskPartTypeReqTempData>,
    kioskPartTypeList: MKioskPartTypeList,
    errorCallback?: ErrCallbackType
  ) => void
  clear: () => void
}

// ** Defaults
const defaultProvider: KioskManagerValuesType = {
  loading: true,
  setLoading: () => Boolean,

  errors: {},
  setErrors: () => null,

  isKioskComponentModalOpen: false,
  setIsKioskComponentModalOpen: () => null,

  selectKioskPartTypeList: {},
  setSelectKioskPartTypeList: () => null,

  kioskPartTypeReq: {},
  setKioskPartTypeReq: () => null,

  kioskPartTypeInsertFn: () => Promise.resolve(),
  kioskPartTypeUpdateFn: () => Promise.resolve(),
  clear: () => null
}

const KioskManagerContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const KioskManagerProvider = ({ children }: Props) => {
  const [isKioskComponentModalOpen, setIsKioskComponentModalOpen] = useState(defaultProvider.isKioskComponentModalOpen)
  const [selectKioskPartTypeList, setSelectKioskPartTypeList] = useState(defaultProvider.selectKioskPartTypeList)
  const [kioskPartTypeReq, setKioskPartTypeReq] = useState(defaultProvider.kioskPartTypeReq)

  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({})

  const { mutateAsync: kioskPartInsert } = useKioskPartInsert()
  const { mutateAsync: kioskPartTypeInsert } = useKioskPartTypeInsert()
  const { mutateAsync: kioskPartTypeUpdate } = useKioskPartTypeUpdate()

  const clear = async () => {
    setKioskPartTypeReq(defaultProvider.kioskPartTypeReq)
    setSelectKioskPartTypeList(defaultProvider.selectKioskPartTypeList)
  }

  const kioskPartTypeInsertFn = async (params: Partial<MKioskPartTypeReqTempData>, errorCallback?: ErrCallbackType) => {
    try {
      const res = await validateFields(params, ['name', 'specification', 'partListName'])
      if (!res.result) {
        throw new Error('필수값을 입력해주세요') // 예외 던지기
      }

      const result =
        params.id === 0
          ? await kioskPartTypeInsert({
              name: params.name,
              iconFileName: params.iconFileName ?? 'AI-Box',
              partList: [
                {
                  name: params.partListName ?? '',
                  specification: params.specification ?? ''
                }
              ]
            })
          : await kioskPartInsert({
              id: params.id,
              specification: params.specification,
              name: params.partListName
            })

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

  const kioskPartTypeUpdateFn = async (
    params: Partial<MKioskPartTypeReqTempData>,
    kioskPartTypeList: MKioskPartTypeList,
    errorCallback?: ErrCallbackType
  ) => {
    try {
      const res = await validateFields(params, ['name', 'specification', 'partListName'])
      if (!res.result) {
        throw new Error('필수값을 입력해주세요') // 예외 던지기
      }

      const updatePartListData: IPartListReq[] = kioskPartTypeList.partList.map(part => {
        if (part.id === params.partListId) {
          return {
            id: params.partListId!,
            name: params.partListName || part.name, // undefined인 경우 기존 값을 사용
            specification: params.specification || part.specification, // undefined인 경우 기존 값을 사용
            dataStatus: part.dataStatus
          }
        }

        return {
          id: part.id,
          name: part.name,
          specification: part.specification,
          dataStatus: part.dataStatus
        }
      })

      const result = await kioskPartTypeUpdate({
        ...kioskPartTypeList,
        name: params.name,
        iconFileName: params.iconFileName,
        partList: updatePartListData
      })

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

  const values: KioskManagerValuesType = {
    loading,
    setLoading,
    errors,
    setErrors,

    isKioskComponentModalOpen: isKioskComponentModalOpen,
    setIsKioskComponentModalOpen: setIsKioskComponentModalOpen,
    selectKioskPartTypeList: selectKioskPartTypeList,
    setSelectKioskPartTypeList: setSelectKioskPartTypeList,
    kioskPartTypeReq: kioskPartTypeReq,
    setKioskPartTypeReq: setKioskPartTypeReq,

    kioskPartTypeInsertFn: kioskPartTypeInsertFn,
    kioskPartTypeUpdateFn: kioskPartTypeUpdateFn,

    clear: clear
  }

  return <KioskManagerContext.Provider value={values}>{children}</KioskManagerContext.Provider>
}

export { KioskManagerContext, KioskManagerProvider }
