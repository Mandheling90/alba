export const EPath = {
  COMMON_LOGIN: '/user/login',
  COMPONENT_LIST: '/view',
  GENERATE_CODE: '/mail/generate',
  VERIFY_CODE: '/mail/verify',
  CHANGE_PASSWORD: '/user/new-password',
  USER_DETAIL: '/user/detail',
  LOG: '/log'
} as const

export const ELocalStorageKey = {
  LGOIN_REMEMBER: 'RememberMe',
  ACCESS_TOKEN: 'accessToken'
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
  SUCCESS: '0',
  FAIL: '-1',
  NONE: '-999',
  DUPLICATION_PARM: '-409'
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
    title: '홍보물 관리',
    path: '/contents',
    icon: 'contents'
  },
  {
    title: '사용자 관리',
    path: '/user-setting',
    icon: 'user-setting'
  },
  {
    title: '키오스크 관리',
    icon: 'kiosk',
    children: [
      {
        title: '키오스크 관리',
        path: '/kiosk'
      },
      {
        title: '구성품 및 타입관리',
        path: '/kiosk/kiosk-manager'
      }
    ]
  },
  {
    title: '통계 및 로그 관리',
    icon: 'statistics',
    children: [
      {
        title: '흡연인구통계',
        path: '/statistics/smoking-statistics'
      }

      // {
      //   title: '유동인구통계',
      //   path: '/statistics/crowd-statistics'
      // }
    ]
  },
  {
    title: '모니터링',
    path: '/monitoring',
    icon: 'monitoring'
  }
]
