export const EPath = {
  COMPANY: '/company',
  COMPANY_SEARCH: '/company/search/list',
  COMPANY_LIST: '/company/list',
  COMPANY_DUPLICATE_CHECK: '/company/duplicate/check',

  AI_COMPANY: '/ai/company',
  AI_SOLUTION_COMPANY_LIST: '/ai/solution/list',
  AI_SOLUTION_SERVICE: '/ai/solution/service'
} as const

export enum KIOSK_STATUS {
  ALL = 9,
  DISABLED = 0,
  ENABLED = 1,
  ERROR = 2
}
