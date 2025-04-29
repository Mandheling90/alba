import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/statisticsEnum'

import MResult from 'src/model/commonModel'
import {
  ICardInfo,
  ICountBarChart,
  ICountLineChart,
  IHeatMapResponse,
  MBarChart,
  MChartNavReq,
  MChartReq,
  MCommonList,
  MGroupList,
  MGroupReq,
  MGroupSettingList,
  MGroupUpSetReq,
  MLineChart,
  MPieChart,
  MTable
} from 'src/model/statistics/StatisticsModel'
import { createDelete, createGet, createPatch, createPost } from 'src/module/reactQuery'

export const useStatsGroupList = (params: MGroupReq) => {
  return useQuery<MResult<MGroupList[]>>([EPath.STATS_GROUP, params], {})
}

export const useStatsGroupListId = (id: number, enabled: boolean) => {
  return useQuery<MResult<MGroupList>>([EPath.STATS_GROUP + `/${id}`], { enabled: enabled })
}

export const useStatsCommonList = (params: MGroupReq) => {
  return useQuery<MResult<MCommonList[]>>([EPath.STATS_COMMON_LIST, params], {})
}

export const useGroupSettingList = (params: MGroupReq) => {
  return useQuery<MResult<MGroupSettingList[]>>([EPath.STATS_COMMON_GROUP, params], {})
}

export const useGroupDelete = () => {
  return useMutation((id: number) => {
    return createDelete<MResult>([EPath.STATS_GROUP + `/${id}`])
  }, {})
}

export const useCrowdGroupInsert = () => {
  return useMutation((params: MGroupUpSetReq) => {
    return createPost<MResult>([EPath.STATS_GROUP_LINE, params])
  }, {})
}
export const useCrowdGroupUpdate = () => {
  return useMutation((params: MGroupUpSetReq) => {
    return createPatch<MResult>([EPath.STATS_GROUP_LINE, params])
  }, {})
}

export const useSmokerGroupInsert = () => {
  return useMutation((params: MGroupUpSetReq) => {
    return createPost<MResult>([EPath.STATS_GROUP_AREA, params])
  }, {})
}
export const useSmokerGroupUpdate = () => {
  return useMutation((params: MGroupUpSetReq) => {
    return createPatch<MResult>([EPath.STATS_GROUP_AREA, params])
  }, {})
}

export const useTripwireLineChart = () => {
  return useMutation(({ params, isGroup }: { params: MChartReq; isGroup: boolean }) => {
    return createGet<MLineChart[]>([isGroup ? EPath.STATS_LINE_LINE_GROUP : EPath.STATS_LINE_LINE, params])
  }, {})
}

export const useTripwireTable = () => {
  return useMutation(({ params, isGroup }: { params: MChartReq; isGroup: boolean }) => {
    return createGet<MTable[]>([isGroup ? EPath.STATS_LINE_TABLE_GROUP : EPath.STATS_LINE_TABLE, params])
  }, {})
}

export const useOccupancyLineChart = () => {
  return useMutation(({ params, isGroup }: { params: MChartReq; isGroup: boolean }) => {
    return createGet<MLineChart[]>([isGroup ? EPath.STATS_AREA_LINE_GROUP : EPath.STATS_AREA_LINE, params])
  }, {})
}

export const useOccupancyBarChartNav = () => {
  return useMutation(({ params, isGroup }: { params: MChartNavReq; isGroup: boolean }) => {
    return createGet<MBarChart[]>([isGroup ? EPath.STATS_AREA_BAR_GROUP_NAV : EPath.STATS_AREA_BAR_NAV, params])
  }, {})
}

export const useOccupancyBarSmokerChartNav = () => {
  return useMutation(({ params, isGroup }: { params: MChartNavReq; isGroup: boolean }) => {
    return createGet<MBarChart[]>([isGroup ? EPath.STATS_AREA_SMOKER_GROUP_NAV : EPath.STATS_AREA_SMOKER_NAV, params])
  }, {})
}

//
export const useOccupancyPieChartNav = () => {
  return useMutation(({ params, isGroup }: { params: MChartNavReq; isGroup: boolean }) => {
    return createGet<MPieChart[]>([isGroup ? EPath.STATS_AREA_PIE_GROUP_NAV : EPath.STATS_AREA_PIE_NAV, params])
  }, {})
}

export const useOccupancyTable = () => {
  return useMutation(({ params, isGroup }: { params: MChartReq; isGroup: boolean }) => {
    return createGet<MTable[]>([isGroup ? EPath.STATS_AREA_TABLE_GROUP : EPath.STATS_AREA_TABLE, params])
  }, {})
}

export const useCountLineChart = () => {
  return useMutation(() => {
    return createGet<ICountLineChart>([EPath.STATS_DASHBOARD_COUNT_LINE_CHART])
  }, {})
}

export const useCountCardInfo = () => {
  return useQuery<MResult<ICardInfo[]>>([EPath.STATS_DASHBOARD_COUNT_CARD_INFO], {})
}

export const useCountBarChart = () => {
  return useQuery<MResult<ICountBarChart>>([EPath.STATS_DASHBOARD_COUNT_BAR_CHART], {})
}

export const useHeatMapData = () => {
  return useQuery<MResult<IHeatMapResponse>>([EPath.STATS_HEATMAP_DATA], {})
}
