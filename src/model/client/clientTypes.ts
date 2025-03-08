// 서비스 형태 enum
export enum ServiceType {
  COUNTING = 'COUNTING',
  CAR_COUNT = 'CAR_COUNT',
  FEATURE_ANALYSIS = 'FEATURE_ANALYSIS',
  MONITORING = 'MONITORING'
}

// 서비스 타입 레이블
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.COUNTING]: '카운팅',
  [ServiceType.CAR_COUNT]: '차량카운트',
  [ServiceType.FEATURE_ANALYSIS]: '특성분석',
  [ServiceType.MONITORING]: '모니터링'
} as const

// 솔루션 분석 enum
export enum SolutionType {
  CVEDIA = 'CVEDIA',
  SAFR = 'SAFR',
  PROAI_EDGE = 'PROAI_EDGE'
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

// 고객사 정보 인터페이스
export interface IClient {
  clientId: string
  clientName: string
  address: string

  businessNumber: string
  businessStatus: string

  contractPeriod: string

  serviceTypes: ServiceType[]
  solutionTypes: SolutionType[]
  analysisChannels: number

  reportGeneration: boolean
  reportEmail: string
  reportReceiver: string

  accountStatus: boolean
  clientAccount: string

  solutions?: ISolutionCard[]
}

// 샘플 데이터
export const sampleClientData: IClient = {
  clientId: 'CLIENT001',
  clientName: '테스트 고객사',
  address: '서울시 강남구 테헤란로 123',
  serviceTypes: [ServiceType.COUNTING, ServiceType.MONITORING],
  solutionTypes: [SolutionType.CVEDIA, SolutionType.PROAI_EDGE],
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
