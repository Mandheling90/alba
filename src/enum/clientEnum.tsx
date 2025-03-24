export const EPath = {
  CONTENTS: '/cameras',
  COMPANY_SEARCH: '/company/search/list'
} as const

export enum KIOSK_STATUS {
  ALL = 9,
  DISABLED = 0,
  ENABLED = 1,
  ERROR = 2
}
