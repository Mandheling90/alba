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
