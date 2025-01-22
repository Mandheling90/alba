import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/kisokEnum'

import MResult from 'src/model/commonModel'
import { MKioskPartReqData, MKioskPartTypeList, MKioskPartTypeReqData } from 'src/model/kiosk/kioskManagerModel'
import { createDelete, createPatch, createPost } from 'src/module/reactQuery'

export const useKioskPartTypeList = () => {
  return useQuery<MResult<MKioskPartTypeList[]>>([EPath.KIOSK_PART_TYPE], {})
}

export const useKioskPartInsert = () => {
  return useMutation((params: Partial<MKioskPartReqData>) => {
    return createPost<MResult>([EPath.KIOSK_PART, params])
  }, {})
}
export const useKioskPartTypeInsert = () => {
  return useMutation((params: Partial<MKioskPartTypeReqData>) => {
    return createPost<MResult>([EPath.KIOSK_PART_TYPE, params])
  }, {})
}
export const useKioskPartTypeUpdate = () => {
  return useMutation((params: Partial<MKioskPartTypeReqData>) => {
    return createPatch<MResult>([EPath.KIOSK_PART_TYPE, params])
  }, {})
}

export const useKioskPartUpdate = () => {
  return useMutation((params: Partial<MKioskPartReqData>) => {
    return createPatch<MResult>([EPath.KIOSK_PART, params])
  }, {})
}

export const useKioskPartDelete = () => {
  return useMutation((params: { id: number }) => {
    return createDelete<MResult>([EPath.KIOSK_PART + `/${params.id}`])
  }, {})
}
