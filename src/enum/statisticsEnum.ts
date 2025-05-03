export enum KIOSK_STATUS {
  ALL = 9,
  DISABLED = 0,
  ENABLED = 1,
  ERROR = 2
}

export type RangeSelectorButtonTypeValue = 'hour' | 'day' | 'month'

type RangeSelectorButtonsOptions = {
  type: RangeSelectorButtonTypeValue
  count: number
  text: string
  title: string
}

export const timeRangeOptions: RangeSelectorButtonsOptions[] = [
  { type: 'hour', count: 6, text: '시', title: '6시간 보기' },
  { type: 'day', count: 7, text: '일', title: '1주일 보기' },
  { type: 'month', count: 1, text: '월', title: '1개월 보기' }
]

export const selectDataColor = 'rgba(78, 84, 207, 1)'

export const chartColorList: string[] = [
  'rgba(255, 180, 0, 1)',
  'rgba(76, 178, 0, 1)',
  'rgba(45, 175, 254, 1)',
  'rgba(255, 97, 102, 1)',
  'rgba(123, 239, 178, 1)',
  'rgba(240, 128, 128, 1)',
  'rgba(70, 130, 180, 1)',
  'rgba(218, 165, 32, 1)',
  'rgba(144, 238, 144, 1)',
  'rgba(255, 105, 180, 1)',
  'rgba(0, 191, 255, 1)',
  'rgba(153, 50, 204, 1)',
  'rgba(255, 69, 0, 1)',
  'rgba(32, 178, 170, 1)',
  'rgba(100, 149, 237, 1)',
  'rgba(255, 182, 193, 1)',
  'rgba(75, 0, 130, 1)',
  'rgba(173, 216, 230, 1)',
  'rgba(34, 139, 34, 1)',
  'rgba(255, 20, 147, 1)',
  'rgba(72, 61, 139, 1)',
  'rgba(255, 160, 122, 1)',
  'rgba(106, 90, 205, 1)',
  'rgba(46, 139, 87, 1)',
  'rgba(189, 183, 107, 1)'
]

export const EPath = {
  STATS_GROUP: '/stats/group',
  STATS_COMMON_LIST: '/stats/common/list',
  STATS_COMMON_GROUP: '/stats/common/group',
  STATS_GROUP_AREA: '/stats/group/area',
  STATS_GROUP_LINE: '/stats/group/line',

  STATS_LINE_LINE: '/stats/line/line',
  STATS_LINE_LINE_GROUP: '/stats/line/line/group',
  STATS_LINE_TABLE: '/stats/line/table',
  STATS_LINE_TABLE_GROUP: '/stats/line/table/group',

  STATS_AREA_BAR_NAV: '/stats/area/bar/nav',

  STATS_AREA_BAR_GROUP_NAV: '/stats/area/bar/nav/group',

  STATS_AREA_SMOKER_NAV: '/stats/area/smoker/nav',

  STATS_AREA_SMOKER_GROUP_NAV: '/stats/area/smoker/nav/group',
  STATS_AREA_LINE: '/stats/area/line',
  STATS_AREA_LINE_GROUP: '/stats/area/line/group',

  STATS_AREA_PIE_NAV: '/stats/area/pie/nav',

  STATS_AREA_PIE_GROUP_NAV: '/stats/area/pie/nav/group',
  STATS_AREA_TABLE: '/stats/area/table',
  STATS_AREA_TABLE_GROUP: '/stats/area/table/group',

  STATS_DASHBOARD_COUNT_LINE_CHART: '/dashboard/count/line/chart',
  STATS_DASHBOARD_COUNT_CARD_INFO: '/dashboard/count/card/info',
  STATS_HEATMAP_DATA: '/stats/heatmap/data',
  STATS_DASHBOARD_COUNT_BAR_CHART: '/dashboard/count/bar/chart',
  STATS_DASHBOARD_GENDER_AGE_CHART: '/dashboard/gender/age/chart'
} as const
