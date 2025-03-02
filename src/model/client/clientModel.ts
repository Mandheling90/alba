// 서비스 형태 enum
export enum SERVICE_TYPE {
  COUNTING = 'COUNTING',
  CAR_COUNT = 'CAR_COUNT',
  FEATURE_ANALYSIS = 'FEATURE_ANALYSIS',
  MONITORING = 'MONITORING'
}

// 솔루션 분석 enum
export enum SOLUTION_TYPE {
  CVEDIA = 'CVEDIA',
  SAFR = 'SAFR',
  PROAI_EDGE = 'PROAI_EDGE'
}

// 고객사 정보 인터페이스
export interface IClient {
  clientId: string
  clientName: string
  address: string
  serviceTypes: SERVICE_TYPE[]
  solutionTypes: SOLUTION_TYPE[]
  analysisChannels: number
  reportGeneration: boolean
  reportEmail: string
  accountStatus: boolean
}
