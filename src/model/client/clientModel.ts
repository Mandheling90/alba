import { YN } from 'src/enum/commonEnum'

// 서비스 형태 enum
export enum SERVICE_TYPE {
  COUNTING = 'COUNTING',
  CAR_COUNT = 'CAR_COUNT',
  FEATURE_ANALYSIS = 'FEATURE_ANALYSIS',
  MONITORING = 'MONITORING',
  OCCUPANCY = 'OCCUPANCY'
}

export const SERVICE_TYPE_LABELS: Record<SERVICE_TYPE, string> = {
  [SERVICE_TYPE.COUNTING]: '카운팅',
  [SERVICE_TYPE.OCCUPANCY]: '밀집도 분석',
  [SERVICE_TYPE.CAR_COUNT]: '차량카운트',
  [SERVICE_TYPE.FEATURE_ANALYSIS]: '특성분석',
  [SERVICE_TYPE.MONITORING]: '모니터링'
} as const

// 솔루션 분석 enum
export enum SOLUTION_TYPE {
  CVEDIA = 'CVEDIA',
  SAFR = 'SAFR',
  NEXREALAIBOX = 'NexRealAIBox',
  PROAI_EDGE = 'PROAI_EDGE',
  FA_GATE = 'FA Gate',
  PROAI_SERVER = 'ProAI Server'
}

export enum SOLUTION_USE_SERVER_TYPE {
  CVEDIA = 'CVEDIA',
  NEXREALAIBOX = 'NexRealAIBox',
  SAFR = 'SAFR',
  FA_GATE = 'FA Gate',
  PROAI_SERVER = 'ProAI Server'
}

// 검색 타입 enum
export enum SEARCH_TYPE {
  COMPANY_NAME = 'companyName',
  COMPANY_ADDRESS = 'companyAddress',
  ACCOUNT_USE_TYPE = 'accountUseType',
  ALL = ''
}

export interface MClientListReq {
  searchType: SEARCH_TYPE
  keyword: string
  offset: number
  size: number
}

export interface MClientList {
  listSize: number
  page: number
  size: number
  totalCount: number
  list: MList[]
}

export interface MList {
  companyNo: number
  companyId: string
  companyName: string
  address: string
  serviceTypes: SERVICE_TYPE[]
  serviceIcons: string[]
  solutionTypes: SOLUTION_TYPE[]
  analysisChannels: number
  reportGeneration: YN
  reportGenerationStr: string
  reportEmail: string
  accountStatus: YN
  accountStatusStr: string
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
// export interface IClientDetail extends IClientBase {
//   solutions?: ISolutionCard[]
// }

export interface IClientDetail {
  companyNo: number
  companyId: string
  companyName: string
  address: string
  brn: string
  expireDate: string
  companyStatus: number
  companyStatusStr: string
  reportGeneration: YN
  reportGenerationStr: string
  reportEmail: string
  accountStatus: YN
  accountStatusStr: string
}

export interface ISolutionList {
  aiSolutionId: number
  aiSolutionName: string
  companySolutionId: number
  serverList: IServerList[]
}

export interface IServerList {
  serverId: number
  serverName: string
  serverIp: string
  aiBoxId: string | null
  aiBoxPassword: string | null
  safrEventUrl: string | null
  safrId: string | null
  safrPassword: string | null
  instanceList: IInstanceList[]
}

export interface IInstanceList {
  instanceId: number | null
  instanceName: string
  aiServiceId: number
  aiServiceName: string
  cameraGroupId: string
  cameraNo: number
  cameraId: string
  cameraName: string
  cameraIp: string
  areaNameList: IAreaNameList[]
}

interface IAreaNameList {
  instanceModelId: number
  instanceModelName: string
}

export interface IAiSolutionCompanyList {
  serviceNames: string
  analysisTotalCount: number
  solutionSummaryList: {
    aiSolutionType: string
    solutionCount: number
  }[]
  solutionList: ISolutionList[]
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

export interface MCompanySearch {
  companyId: string
  companyName: string
}

export interface MAiSolutionCompanyList {
  id: number
  name: string
  dataStatus: string
  dataStatusStr: string
}

export interface ISolutionServerProps {
  solutionId: number
  server: IServerList
  onDelete: (serviceId: number) => void
  onDeleteInstance: (serverId: number, instanceId: number) => void
  onUpdateInstance: (serverId: number, instanceId: number, field: string, value: string) => void
  onUpdateServer: (serverId: number, field: string, value: string) => void
}

export interface IAiSolutionService {
  aiServiceId: number
  aiServiceName: string
  iconName: string
  dataStatus: string
  dataStatusStr: string
}
