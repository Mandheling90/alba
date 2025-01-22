import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/kisokEnum'

import MResult from 'src/model/commonModel'
import {
  KioskListReq,
  MKiosk,
  MKioskContent,
  MKioskContentReq,
  MKioskDeleteReq,
  MKioskType,
  MKioskTypeReq,
  MKioskUpdateReq
} from 'src/model/kiosk/kioskModel'
import { TcpRelay } from 'src/model/monitoring/monitoringModel'
import { createDelete, createGet, createPatch, createPost } from 'src/module/reactQuery'

export const useKioskList = (req: KioskListReq, onSuccess?: (data: MResult<MKiosk[]>) => void) => {
  return useQuery<MResult<MKiosk[]>>([EPath.KIOSK, req], {
    onSuccess // onSuccess 콜백을 useQuery에 전달
  })
}

export const useKioskUpdate = () => {
  return useMutation((params: Partial<MKioskUpdateReq>) => {
    return createPatch<MResult>([EPath.KIOSK, params])
  }, {})
}

export const useKioskDelete = () => {
  return useMutation((params: MKioskDeleteReq[]) => {
    return createDelete<MResult>([EPath.KIOSK, params])
  }, {})
}

export const useKioskContentsDelete = () => {
  return useMutation((params: MKioskDeleteReq) => {
    return createDelete<MResult>([EPath.KIOSK_CONTENTS, params])
  }, {})
}

export const useKioskInsert = () => {
  return useMutation((params: Partial<MKioskUpdateReq>) => {
    return createPost<MResult>([EPath.KIOSK, params])
  }, {})
}

export const useKioskContentsList = (params: { contents: number }) => {
  return useQuery<MResult<MKioskContent[]>>([EPath.KIOSK_CONTENTS + `/${params.contents}`], {})
}

export const useKioskContentsUpdate = () => {
  return useMutation((params: MKioskContentReq) => {
    return createPatch<MResult>([EPath.KIOSK_CONTENTS, params])
  }, {})
}

export const useKioskTypeList = () => {
  return useQuery<MResult<MKioskType[]>>([EPath.KIOSK_TYPE], {})
}

export const useKioskTypeListUpdate = () => {
  return useMutation((params: MKioskTypeReq) => {
    return createPatch<MResult>([EPath.KIOSK_TYPE, params])
  }, {})
}

export const useKioskTypeListInsert = () => {
  return useMutation((params: MKioskTypeReq) => {
    return createPost<MResult>([EPath.KIOSK_TYPE, params])
  }, {})
}

export const useKioskTypeListDelete = () => {
  return useMutation((params: { id: number }) => {
    return createDelete<MResult>([EPath.KIOSK_TYPE + `/${params.id}`, params])
  }, {})
}

export const useMonitoringTcpRelay = () => {
  return useMutation((params: TcpRelay) => {
    return createGet<MResult>([EPath.MONITORING_TCP_RELAY, { ...params }])
  }, {})
}
