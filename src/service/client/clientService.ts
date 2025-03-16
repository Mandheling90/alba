import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/contentsEnum'

import { IClient, IClientDetail, SERVICE_TYPE, SOLUTION_TYPE } from 'src/model/client/clientModel'
import MResult from 'src/model/commonModel'
import { MContent, MContentReq, MContentsDeleteReq, MKioskContentList } from 'src/model/contents/contentsModel'
import { createDelete, createFilePatch, createFilePost, createGet } from 'src/module/reactQuery'

// 샘플 데이터
export const sampleClientsList: IClient[] = []

export const sampleClientDetail: IClientDetail = {
  clientId: 'CLIENT001',
  clientName: '테스트 고객사',
  address: '서울시 강남구 테헤란로 123',
  serviceTypes: [SERVICE_TYPE.COUNTING, SERVICE_TYPE.MONITORING],
  solutionTypes: [SOLUTION_TYPE.CVEDIA, SOLUTION_TYPE.PROAI_EDGE],
  analysisChannels: 2,
  reportGeneration: true,
  reportEmail: 'test@example.com',
  accountStatus: true,
  businessNumber: '123-45-67890',
  businessStatus: '1',
  contractPeriod: '2024-03-20 ~ 2025-03-19',
  reportReceiver: 'receiver@example.com',
  clientAccount: 'testaccount',
  solutions: [
    {
      id: 0,
      selectedSolution: '1',
      services: [
        {
          id: '1',
          name: '정문 카메라',
          serviceType: '1',
          address: '192.168.0.100',
          rtsAddress: 'rtsp://192.168.0.100:554/stream',
          description: '정문 출입구 모니터링'
        },
        {
          id: '2',
          name: '주차장 카메라',
          serviceType: '2',
          address: '192.168.0.101',
          rtsAddress: 'rtsp://192.168.0.101:554/stream',
          description: '주차장 차량 카운팅'
        }
      ]
    }
  ]
}

export const useClientList = (req?: MContentReq) => {
  // 실제 API 호출 대신 샘플 데이터 반환
  return useQuery<MResult<IClient[]>>([EPath.CONTENTS, req], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampleClientsList
    })
  })
}

export const useClientDetail = (id?: number) => {
  return useQuery<MResult<IClientDetail>>([EPath.CONTENTS, id], () => {
    return Promise.resolve({
      code: '0',
      msg: '성공',
      data: sampleClientDetail
    })
  })
}

export const useListKiosksByContent = (id: number[]) => {
  return useQuery<MResult<MKioskContentList[]>>([EPath.CONTENTS + `/${id.join(',')}`], {})
}

export const useContentsDelete = () => {
  return useMutation((params: MContentsDeleteReq[]) => {
    return createDelete<MResult>([EPath.CONTENTS, params])
  }, {})
}

export const useContentsUpdate = () => {
  return useMutation((params: Partial<MContent>) => {
    return createFilePatch<MResult>([EPath.CONTENTS, params])
  }, {})
}

export const useContentsInsert = () => {
  return useMutation((params: Partial<MContent>) => {
    return createFilePost<MResult>([EPath.CONTENTS, params])
  }, {})
}

export const useContentsListDetail = () => {
  return useMutation((id: number) => {
    return createGet<MContent>([EPath.CONTENTS_DETAIL + `/${id}`])
  }, {})
}

// export const useContentsListDetail = (id: number) => {
//   return useQuery<MResult<MContent>>([EPath.CONTENTS_DETAIL + `/${id}`], { enabled: false })
// }
