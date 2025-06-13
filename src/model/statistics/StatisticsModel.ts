import { RangeSelectorButtonTypeValue } from 'src/enum/statisticsEnum'

export interface MKioskData {
  kioskId: number
  kioskName: string
  statsId: number
  statsName: string
}

export interface MGroupList {
  id: number
  name: string
  data: MKioskData[]
}

export interface MCommonInfo {
  statsId: number
  statsName: string
}

export interface MCommonList {
  kioskId: number
  kioskName: string
  info: MCommonInfo[]
}

export interface MGroupSettingList {
  kioskId: number
  kioskName: string
  kioskLocation: string
  statsId: number
  statsName: string
}

export interface IChartProps {
  rangeSelectorIndex: number
  time: RangeSelectorButtonTypeValue
  startDate: string
  endDate: string
  isChartSetting: boolean
  isGroup: boolean
}

export interface MRealtimeDetailParam {
  item: number
  cameraIds: number[]
  startDate: string
  endDate: string
}

export interface MGroupReq {
  type: string
}

export interface MGroupUpSetReq {
  id?: number
  name: string
  modelTypeIdList: number[]
}

export interface ICheckedList {
  statsIdList: number[]
  groupIdList: number[]
}

export interface MChartReq {
  startDate: string
  endDate: string
  statsIdList?: number[]
  groupIdList?: number[]
  time: string
}

export interface MChartNavReq {
  startDateTime: string
  endDateTime: string
  startDate?: string
  endDate?: string
  statsIdList?: number[]
  groupIdList?: number[]
  time: string
}

export interface MLineChart {
  id: number
  label: string
  statsData: [number, number][]

  color?: string
}

export interface MBarChart {
  id: number
  name: string
  y: number

  color?: string
  checked?: boolean
}

export interface MPieChart {
  id: number
  name: string
  count: number
  y: number

  z?: number
  color?: string
  checked?: boolean
}

export interface MTable {
  kioskId: number
  kioskName: string
  kioskLocation: string
  date: string
  time: string

  lineName?: string
  count?: number

  areaName?: string
  smokerCount?: number
  peopleCount?: number

  display?: boolean
  id?: number
}

export interface ISelectedColorList {
  id: number
  color: string
}

export interface ICountLineChart {
  startYear: string
  startMonth: string
  startDay: string
  startHour: string
  endYear: string
  endMonth: string
  endDay: string
  endHour: string
  totalPlaceCount: number
  lineDataList: ILineDataList[]
  yname: string
}

export interface ILineDataList {
  label: string
  dataList: { timestamp: number; count: number }[]
}

export interface ICardInfo {
  lastDate: string
  lastLabel: string
  lastCount: number
  currentDate: string
  currentLabel: string
  currentCount: number
  rateLabel: string
  rate: number
  weatherDate: string
  weatherLabel: string
  morningLabel: string
  afternoonLabel: string
  dustValue: string
}

export interface IHeatMapData {
  hour: number
  ageGroup: string
  visitors: number
  male: number
  female: number
}

export interface IHeatMapResponse {
  data: IHeatMapData[]
}

export interface IBaseChartResponse {
  startYear: string
  startMonth: string
  startDay: string
  startHour: string
  endYear: string
  endMonth: string
  endDay: string
  endHour: string
  totalPlaceCount: number
  yname: string
  tableHeaders?: ITableHeaders[] | string[]
  tableTopHeaders?: ITableHeaders[]

  chartTitle: string
  chartSubTitle: string
}

export interface ITableHeaders {
  field: string
  headerName: string
}

export interface IBaseDashboardChartResponse {
  day: string
  endHour: string
  month: string
  startHour: string
  totalPlaceCount: number
  year: string
  yname: string

  chartTitle: string
  chartSubTitle: string
}

export interface ILineChartResponse extends IBaseDashboardChartResponse {
  lineDataList: ILineDataList[]
}

export interface IDashboardCountBarChart extends IBaseDashboardChartResponse {
  barDataList: IBarDataList[]
  exitCountList: IBarDataList[]
  xcategories: string[]
}

export interface IBarDataList {
  name: string
  dataList: number[]
}

export interface IPyramidPieChart extends IBaseChartResponse {
  categories: string[]
  pyramidChart: IPyramidChart[]
  pieChart: IPieChart
}

export interface IPyramidChart {
  name: string
  data: number[]
}

export interface IPieChart {
  name: string
  data: IPieChartData[]
}

export interface IPieChartData {
  name: string
  y: number
}

export interface ICameraList {
  cameraList: ICamera[]
  cameraGroupList: ICameraGroup[]
}

export interface ICamera {
  cameraNo: number
  cameraName: string
  cameraId: string
}

export interface ICameraGroup {
  cameraGroupId: number
  cameraGroupName: string
  cameraList: ICamera[]
}

export interface IStatisticsReq {
  cameraNos?: number[] | string
  cameraGroupIds?: number[] | string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  ageType?: string
  companyNo?: number
}

export interface ICountBarChart extends IBaseChartResponse {
  chartDataList: IChartDataList[]
  xtitle: string
  ytitle: string
  xaxisDataList: string[]
  xcategories: string[]
}

export interface IChartDataList {
  name: string
  dataList: number[]
}

export interface ICountBarPieChart extends IBaseChartResponse {
  barChart: IBarChart
  pieChart: IPieChart
}

export interface IBarChart {
  chartDataList: IChartDataList[]
  xcategories: string[]
  xtitle: string
  ytitle: string
}

export interface ITableData extends IBaseChartResponse {
  totalInCount: number
  totalOutCount: number
  dataList: IDataList1[]
}

export interface IDataList1 {
  dateName: string
  totalPlaceName: string
  totalInCount: number
  totalOutCount: number
  dataList: IDataList2[]
}

export interface IDataList2 {
  dateName: string
  totalPlaceName: string
  totalInCount: number
  totalOutCount: number
  dataList: IDataList3[]
}

export interface IDataList3 {
  placeName: string
  inCount: number
  outCount: number
}

export interface IHeatMapChart extends IBaseChartResponse {
  title: string
  xaxisCategories: string[]
  yaxisCategories: string[]
  dataList: IHeatMapDataList[]
}

export interface IHeatMapDataList {
  x: number
  y: number
  visitors: number
  male: number
  female: number
  value: number
}

export interface IAgeGenderStatistics {
  dateName: string
  totalPlaceName: string
  totalM0: number
  totalM10: number
  totalM20: number
  totalM30: number
  totalM40: number
  totalM50: number
  totalM60: number
  totalF0: number
  totalF10: number
  totalF20: number
  totalF30: number
  totalF40: number
  totalF50: number
  totalF60: number
  totalManCount: number
  totalWomanCount: number
  totalCount: number
  dataList: IAgeGenderPlaceStatistics[]
}

export interface IAgeGenderPlaceStatistics {
  placeName: string
  m0: number
  m10: number
  m20: number
  m30: number
  m40: number
  m50: number
  m60: number
  f0: number
  f10: number
  f20: number
  f30: number
  f40: number
  f50: number
  f60: number
  totalManCount: number
  totalWomanCount: number
  totalCount: number
}

export interface IAgeGenderStatisticsTableResponse extends IBaseChartResponse {
  totalManCount: number
  totalPlaceCount: number
  totalWomanCount: number
  dataList: IAgeGenderStatistics[]
}

export interface ICountLineChartPolling {
  hour: string
  totalPlaceCount: number
  lineDataList: ILineData[]
  yname: string
}

export interface ILineData {
  label: string
  data: {
    timestamp: number
    count: number
  }
}

export interface IConfig {
  dataList: IDepth1List[]
}

export interface IDepth1List {
  id: number
  menuName: string
  menuPosition: string
  defaultConfigValue: string
  changeConfigValue: string
  dataList: IDepth2List[]

  isEdit?: boolean
}

export interface IDepth2List {
  id: number
  menuName: string
  menuPosition: string
  defaultConfigValue: string
  changeConfigValue: string

  isEdit?: boolean
}

export interface IConfigMulti {
  companyNo: number
  dataList: IDepth1List[]
}

export interface IConfigSingle {
  companyNo: number
  id: number
  changeConfigValue: string
}

export interface IAreaStatsDtoList {
  areaId: number
  areaName: string
  maxCapacity: number
  areaCount: number
  occupancyRate: number
  alarmLevel: number
}

export interface IAreaStatsDto {
  areaStatsDtoList: IAreaStatsDtoList[]
}
