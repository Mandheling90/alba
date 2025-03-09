// 서비스 형태 enum
export enum SERVICE_TYPE {
  COUNTING = 'COUNTING',
  CAR_COUNT = 'CAR_COUNT',
  FEATURE_ANALYSIS = 'FEATURE_ANALYSIS',
  MONITORING = 'MONITORING'
}

export const SERVICE_TYPE_LABELS: Record<SERVICE_TYPE, string> = {
  [SERVICE_TYPE.COUNTING]: '카운팅',
  [SERVICE_TYPE.CAR_COUNT]: '차량카운트',
  [SERVICE_TYPE.FEATURE_ANALYSIS]: '특성분석',
  [SERVICE_TYPE.MONITORING]: '모니터링'
} as const

// 솔루션 분석 enum
export enum SOLUTION_TYPE {
  CVEDIA = 'CVEDIA',
  SAFR = 'SAFR',
  PROAI_EDGE = 'PROAI_EDGE'
}

// 공통 고객사 정보 인터페이스
export interface IClientBase {
  clientId: string
  clientName: string
  address: string
  serviceTypes: SERVICE_TYPE[]
  solutionTypes: SOLUTION_TYPE[]
  analysisChannels: number
  reportGeneration: boolean
  reportEmail: string
  accountStatus: boolean
  businessNumber: string
  businessStatus: string
  contractPeriod: string
  reportReceiver: string
  clientAccount: string
  solutions?: ISolutionCard[]
}

// 기본 고객사 정보 인터페이스
export type IClient = IClientBase

// 상세 고객사 정보 인터페이스
export interface IClientDetail extends IClientBase {
  solutions?: ISolutionCard[]
}

export interface IService {
  id: string
  name: string
  serviceType: string
  address?: string
  rtsAddress?: string
  description?: string
}

export interface ISolutionCard {
  id: number
  selectedSolution: string
  services: IService[]
}

// 카메라 서비스 인터페이스
export interface IService {
  id: string
  name: string
  serviceType: string
  address?: string
  rtsAddress?: string
  description?: string
}

// 솔루션 카드 인터페이스
export interface ISolutionCard {
  id: number
  selectedSolution: string
  services: IService[]
}

// 샘플 데이터
export const sampleClientData: IClient = {
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
