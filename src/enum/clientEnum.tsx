export const EPath = {
  COMPANY: '/company',
  COMPANY_SEARCH: '/company/search/list',
  COMPANY_LIST: '/company/list',
  COMPANY_DUPLICATE_CHECK: '/company/duplicate/check',

  AI_COMPANY: '/ai/company',
  AI_COMPANY_PACKAGE: '/ai/company/package',
  AI_SOLUTION_COMPANY_LIST: '/ai/solution/list',
  AI_SOLUTION_SERVICE: '/ai/solution/service',
  AI_COMPANY_SERVER: '/ai/company/server',
  AI_COMPANY_INSTANCE: '/ai/company/instance'
} as const

export enum KIOSK_STATUS {
  ALL = 9,
  DISABLED = 0,
  ENABLED = 1,
  ERROR = 2
}
