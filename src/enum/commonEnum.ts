export const EPath = {
  COMMON_LOGIN: '/auth/login',
  COMPONENT_LIST: '/view',
  GENERATE_CODE: '/mail/generate',
  VERIFY_CODE: '/auth/verify/code',
  CHANGE_PASSWORD: '/auth/change/password',
  USER_DETAIL: '/user/detail',
  LOG: '/log',
  USER_INFO: '/user/info',
  CUSTOMER_LIST: '/customer/list',
  GATE_LIST: '/gate/list',
  SCHEDULE_BATCH_UPDATE: '/schedule/batch'
} as const

export const ELocalStorageKey = {
  LGOIN_REMEMBER: 'RememberMe',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken'
} as const

export enum EResultCode {
  SUCCESS = 'S',
  FAIL = 'F'
}

export const EErrorMessage = {
  LOGIN_FALL: '로그인 정보가 유효하지 않습니다.',
  COMMON_ERROR: '시스템에러가 발생했습니다. 잠시 후 다시 시도 해주세요.'
} as const

export const EApiResultCode = {
  SUCCESS: 200,
  FAIL: -1,
  NONE: -999,
  DUPLICATION_PARM: -409
} as const

export enum YN {
  Y = 'Y',
  N = 'N',
  D = 'D'
}

export enum SORT {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export const EComponentList = [
  {
    title: '대쉬보드',
    icon: 'dashboard',
    children: [
      {
        title: '방문자수 통계',
        path: '/dashboard/visitors'
      },
      {
        title: '방문자수 통계 - 시간별',
        path: '/dashboard/visitorsByHour'
      },
      {
        title: '방문자 특성 통계',
        path: '/dashboard/visitorAttributes'
      },
      {
        title: '방문자 특성 통계 - 시간별',
        path: '/dashboard/visitorAttributesByHour'
      }
    ]
  },

  {
    title: '고객사 관리',
    path: '/clients',
    icon: 'contents'
  },
  {
    title: '사용자 관리',
    path: '/user-setting',
    icon: 'user-setting'
  },
  {
    title: '카메라 관리',
    path: '/cameras',
    icon: 'cameras'
  },
  {
    title: '스케쥴 관리',
    path: '/schedules',
    icon: 'contents'
  }
]
