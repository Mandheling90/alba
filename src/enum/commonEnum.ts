export const EPath = {
  COMMON_LOGIN: '/auth/login',
  COMPONENT_LIST: '/view',
  GENERATE_CODE: '/mail/generate',
  VERIFY_CODE: '/auth/verify/code',
  CHANGE_PASSWORD: '/auth/change/password',
  USER_DETAIL: '/user/detail',
  LOG: '/log',
  CUSTOMER_LIST: '/customer/list',
  GATE_LIST: '/gate/list',
  USER_INFO: '/user/info',
  MENU_LIST: '/menu/list'
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
        title: '방문자 특성 통계',
        path: '/dashboard/visitorAttributes'
      }
    ]
  },
  {
    title: '방문자수 통계',
    icon: 'visitor-report',
    children: [
      {
        title: '시간대별',
        path: '/visitor-report/hourly'
      },
      {
        title: '일별',
        path: '/visitor-report/daily'
      },
      {
        title: '요일별',
        path: '/visitor-report/week-day'
      },
      {
        title: '주별',
        path: '/visitor-report/weekly'
      },
      {
        title: '월별',
        path: '/visitor-report/monthly'
      }
    ]
  },
  {
    title: '방문자 특성 통계',
    icon: 'visitor-attributes-statistics',
    children: [
      {
        title: '시간대별',
        path: '/visitor-attributes-statistics/hourly'
      },
      {
        title: '일별',
        path: '/visitor-attributes-statistics/daily'
      },
      {
        title: '요일별',
        path: '/visitor-attributes-statistics/week-day'
      },
      {
        title: '주별',
        path: '/visitor-attributes-statistics/weekly'
      },
      {
        title: '월별',
        path: '/visitor-attributes-statistics/monthly'
      }
    ]
  },
  {
    title: '혼잡도 분석 통계',
    icon: 'congestion-analysis-statistics',
    children: [
      {
        title: '시간대별',
        path: '/congestion-analysis-statistics/hourly'
      },
      {
        title: '일별',
        path: '/congestion-analysis-statistics/daily'
      },
      {
        title: '요일별',
        path: '/congestion-analysis-statistics/weekly'
      },
      {
        title: '월별',
        path: '/congestion-analysis-statistics/monthly'
      }
    ]
  },
  {
    title: '차량수 통계',
    icon: 'vehicle-statistics',
    children: [
      {
        title: '시간대별',
        path: '/vehicle-statistics/hourly'
      },
      {
        title: '일별',
        path: '/vehicle-statistics/daily'
      },
      {
        title: '요일별',
        path: '/vehicle-statistics/weekly'
      },
      {
        title: '월별',
        path: '/vehicle-statistics/monthly'
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
    icon: 'cameras',
    children: [
      {
        title: '카메라 위치등록',
        path: '/cameras'
      },
      {
        title: '사용자별 카메라설정',
        path: '/cameras/user-setting'
      }
    ]
  },
  {
    title: '스케쥴 관리',
    path: '/schedules',
    icon: 'contents'
  }
]
