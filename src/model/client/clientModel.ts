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

export const SERVICE_TYPE_ICONS: Record<SERVICE_TYPE, string> = {
  [SERVICE_TYPE.COUNTING]: 'COUNTING',
  [SERVICE_TYPE.OCCUPANCY]: 'OCCUPANCY',
  [SERVICE_TYPE.CAR_COUNT]: 'CAR_PEOPLE',
  [SERVICE_TYPE.FEATURE_ANALYSIS]: 'FEATURE',
  [SERVICE_TYPE.MONITORING]: 'MONITORING'
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

export enum SOLUTION_TYPE_ID {
  CVEDIA = 1,
  SAFR = 2,
  PROAI_EDGE = 3,
  PROAI_SERVER = 4,
  VCA = 5,
  FA_SIGNAGE = 6,
  FA_GATE = 7,
  NEX_REAL_3D = 8,
  NEX_REAL_AI = 9,
  NEX_REAL_AIBOX = 10,
  PACKAGE = 99
}

// 서버를 사용하는 솔루션 ID 목록
export const SERVER_USING_SOLUTIONS = [
  SOLUTION_TYPE_ID.CVEDIA,
  SOLUTION_TYPE_ID.SAFR,
  SOLUTION_TYPE_ID.PROAI_SERVER,
  SOLUTION_TYPE_ID.FA_SIGNAGE,
  SOLUTION_TYPE_ID.FA_GATE,
  SOLUTION_TYPE_ID.NEX_REAL_AIBOX
]

// 서버를 사용하지 않는 솔루션 ID 목록
export const NON_SERVER_SOLUTIONS = [
  SOLUTION_TYPE_ID.PROAI_EDGE,
  SOLUTION_TYPE_ID.VCA,
  SOLUTION_TYPE_ID.NEX_REAL_3D,
  SOLUTION_TYPE_ID.NEX_REAL_AI
]

// 특수 솔루션 ID 목록
export const SPECIAL_SOLUTIONS = {
  PACKAGE: SOLUTION_TYPE_ID.PACKAGE
}

// 서버 사용 여부 확인 함수
export const isServerUsingSolution = (solutionId: SOLUTION_TYPE_ID): boolean => {
  return SERVER_USING_SOLUTIONS.includes(solutionId)
}

// 서버 사용하지 않는 솔루션 확인 함수
export const isNonServerSolution = (solutionId: SOLUTION_TYPE_ID): boolean => {
  return NON_SERVER_SOLUTIONS.includes(solutionId)
}

// 특수 솔루션 확인 함수
export const isSpecialSolution = (solutionId: SOLUTION_TYPE_ID, type: keyof typeof SPECIAL_SOLUTIONS): boolean => {
  return solutionId === SPECIAL_SOLUTIONS[type]
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
  isNew?: boolean
  serverList: IServerList[]
}

export interface IServerList {
  remark?: string
  serverId: number
  serverName: string
  serverIp: string
  aiBoxId: string | null
  aiBoxPassword: string | null
  safrEventUrl: string | null
  safrId: string | null
  safrPassword: string | null
  instanceList: IInstanceList[]
  isNew?: boolean
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
  isNew?: boolean
}

interface IAreaNameList {
  instanceModelId: number
  instanceModelName: string
}

export interface IAiSolutionCompanyPackage {
  packageYn: string
  packageYnStr: string
  remark: string
}

export interface IAiSolutionCompanyList {
  serviceNames: string
  packageInfo: IAiSolutionCompanyPackage
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
  aiSolutionService: IAiSolutionService[]
  solutionId: number
  server: IServerList
  onDelete: (serviceId: number) => void
  onDeleteInstance: (serverId: number, instanceId: number) => void
  onUpdateInstance: (serverId: number, instanceId: number, field: string, value: string) => void
  onUpdateServer: (serverId: number, field: string, value: string) => void
  onAddInstance: (serverId: number) => void
  useCameraId?: boolean
  useCameraGroup?: boolean
  useInstance?: boolean
  children?: React.ReactNode
}

export interface IAiSolutionService {
  aiServiceId: number
  aiServiceName: string
  iconName: string
  dataStatus?: string
  dataStatusStr?: string
}

export interface IAiSolutionCompanyPackageParam {
  companyNo: number
  remark: string
}

export const createAiSolutionService = (type: SERVICE_TYPE): IAiSolutionService => ({
  aiServiceId: 0, // 실제 ID는 서버에서 할당
  aiServiceName: SERVICE_TYPE_LABELS[type],
  iconName: SERVICE_TYPE_ICONS[type]
})
