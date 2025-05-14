import { useMutation, useQuery } from 'react-query'
import { EPath } from 'src/enum/statisticsEnum'

import MResult from 'src/model/commonModel'
import {
  IAgeGenderStatisticsTableResponse,
  ICameraList,
  ICardInfo,
  IConfig,
  IConfigMulti,
  ICountBarChart,
  ICountBarPieChart,
  ICountLineChartPolling,
  IDashboardCountBarChart,
  IHeatMapChart,
  IHeatMapResponse,
  ILineChartResponse,
  IPyramidPieChart,
  IStatisticsReq,
  ITableData,
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
import { createDelete, createGet, createPatch, createPost, createPut } from 'src/module/reactQuery'

/**
 * 통계 데이터 파싱을 위한 공통 유틸리티 함수
 * @param params 통계 요청 파라미터
 * @returns 변환된 파라미터
 */
export const transformStatisticsParams = (params: IStatisticsReq): IStatisticsReq => {
  const transformedParams: IStatisticsReq = {
    ...params,
    startDate: params.startDate?.replace(/-/g, ''),
    endDate: params.endDate?.replace(/-/g, '')
  }

  // cameraNos가 존재하고 빈 배열이 아닌 경우에만 변환
  if (params.cameraNos && (Array.isArray(params.cameraNos) ? params.cameraNos.length > 0 : params.cameraNos)) {
    transformedParams.cameraNos = Array.isArray(params.cameraNos) ? params.cameraNos.join(',') : params.cameraNos
  } else {
    delete transformedParams.cameraNos
  }

  // cameraGroupIds가 존재하고 빈 배열이 아닌 경우에만 변환
  if (
    params.cameraGroupIds &&
    (Array.isArray(params.cameraGroupIds) ? params.cameraGroupIds.length > 0 : params.cameraGroupIds)
  ) {
    transformedParams.cameraGroupIds = Array.isArray(params.cameraGroupIds)
      ? params.cameraGroupIds.join(',')
      : params.cameraGroupIds
  } else {
    delete transformedParams.cameraGroupIds
  }

  return transformedParams
}

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
  return useQuery<MResult<ILineChartResponse>>([EPath.STATS_DASHBOARD_COUNT_LINE_CHART], {})
}

export const useCountLineChartPolling = () => {
  return useMutation((params: { lastDate: string; lastTime: string }) => {
    return createGet<ICountLineChartPolling>([EPath.STATS_DASHBOARD_COUNT_LINE_CHART_POLLING, params])
  }, {})
}

export const useCountCardInfo = () => {
  return useQuery<MResult<ICardInfo[]>>([EPath.STATS_DASHBOARD_COUNT_CARD_INFO], {})
}

export const useCountBarChart = () => {
  return useQuery<MResult<IDashboardCountBarChart>>([EPath.STATS_DASHBOARD_COUNT_BAR_CHART], {})
}

export const useGenderAgeChart = () => {
  return useQuery<MResult<IPyramidPieChart>>([EPath.STATS_DASHBOARD_GENDER_AGE_CHART], {})
}

export const useHeatMapData = () => {
  return useQuery<MResult<IHeatMapResponse>>([EPath.STATS_HEATMAP_DATA], {})
}

export const useSearchCameraList = (params: { companyNo: number }) => {
  const url = EPath.STATS_SEARCH_CAMERA_LIST.replace('{companyNo}', params.companyNo.toString())

  return useQuery<MResult<ICameraList>>([url], {})
}

export const useSearchCameraListMutation = () => {
  return useMutation((params: { companyNo: number }) => {
    const url = EPath.STATS_SEARCH_CAMERA_LIST.replace('{companyNo}', params.companyNo.toString())

    return createGet<ICameraList>([url])
  }, {})
}

export const useGenderAgeHourlyBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_GENDER_AGE_HOURLY_BAR_CHART, transformedParams])
  }, {})
}
export const useGenderAgeHourlyPyramidPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IPyramidPieChart>([EPath.STATS_GENDER_AGE_HOURLY_PYRAMID_PIE_CHART, transformedParams])
  }, {})
}
export const useGenderAgeHourlyHeatmapChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IHeatMapChart>([EPath.STATS_GENDER_AGE_HOURLY_HEATMAP_CHART, transformedParams])
  }, {})
}
export const useGenderAgeHourlyTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IAgeGenderStatisticsTableResponse>([EPath.STATS_GENDER_AGE_HOURLY_TABLE, transformedParams])
  }, {})
}

export const useGenderAgeDailyBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_GENDER_AGE_DAILY_BAR_CHART, transformedParams])
  }, {})
}
export const useGenderAgeDailyPyramidPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IPyramidPieChart>([EPath.STATS_GENDER_AGE_DAILY_PYRAMID_PIE_CHART, transformedParams])
  }, {})
}
export const useGenderAgeDailyHeatmapChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IHeatMapChart>([EPath.STATS_GENDER_AGE_DAILY_HEATMAP_CHART, transformedParams])
  }, {})
}
export const useGenderAgeDailyTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IAgeGenderStatisticsTableResponse>([EPath.STATS_GENDER_AGE_DAILY_TABLE, transformedParams])
  }, {})
}

export const useGenderAgeWeekDayBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_GENDER_AGE_WEEK_DAY_BAR_CHART, transformedParams])
  }, {})
}
export const useGenderAgeWeekDayPyramidPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IPyramidPieChart>([EPath.STATS_GENDER_AGE_WEEK_DAY_PYRAMID_PIE_CHART, transformedParams])
  }, {})
}
export const useGenderAgeWeekDayHeatmapChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IHeatMapChart>([EPath.STATS_GENDER_AGE_WEEK_DAY_HEATMAP_CHART, transformedParams])
  }, {})
}
export const useGenderAgeWeekDayTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IAgeGenderStatisticsTableResponse>([EPath.STATS_GENDER_AGE_WEEK_DAY_TABLE, transformedParams])
  }, {})
}

export const useGenderAgeWeeklyBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_GENDER_AGE_WEEKLY_BAR_CHART, transformedParams])
  }, {})
}
export const useGenderAgeWeeklyPyramidPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IPyramidPieChart>([EPath.STATS_GENDER_AGE_WEEKLY_PYRAMID_PIE_CHART, transformedParams])
  }, {})
}
export const useGenderAgeWeeklyHeatmapChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IHeatMapChart>([EPath.STATS_GENDER_AGE_WEEKLY_HEATMAP_CHART, transformedParams])
  }, {})
}
export const useGenderAgeWeeklyTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IAgeGenderStatisticsTableResponse>([EPath.STATS_GENDER_AGE_WEEKLY_TABLE, transformedParams])
  }, {})
}

export const useGenderAgeMonthlyBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_GENDER_AGE_MONTHLY_BAR_CHART, transformedParams])
  }, {})
}
export const useGenderAgeMonthlyPyramidPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IPyramidPieChart>([EPath.STATS_GENDER_AGE_MONTHLY_PYRAMID_PIE_CHART, transformedParams])
  }, {})
}
export const useGenderAgeMonthlyHeatmapChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IHeatMapChart>([EPath.STATS_GENDER_AGE_MONTHLY_HEATMAP_CHART, transformedParams])
  }, {})
}
export const useGenderAgeMonthlyTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<IAgeGenderStatisticsTableResponse>([EPath.STATS_GENDER_AGE_MONTHLY_TABLE, transformedParams])
  }, {})
}

export const useCountHourlyBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_COUNT_HOURLY_BAR_CHART, transformedParams])
  }, {})
}

export const useCountHourlyBarPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarPieChart>([EPath.STATS_COUNT_HOURLY_BAR_PIE_CHART, transformedParams])
  }, {})
}

export const useCountHourlyBarTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ITableData>([EPath.STATS_COUNT_HOURLY_BAR_TABLE, transformedParams])
  }, {})
}

export const useCountDailyTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ITableData>([EPath.STATS_COUNT_DAILY_TABLE, transformedParams])
  }, {})
}

export const useCountDailyBarPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarPieChart>([EPath.STATS_COUNT_DAILY_BAR_PIE_CHART, transformedParams])
  }, {})
}

export const useCountDailyBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_COUNT_DAILY_BAR_CHART, transformedParams])
  }, {})
}

export const useCountWeeklyTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ITableData>([EPath.STATS_COUNT_WEEKLY_TABLE, transformedParams])
  }, {})
}

export const useCountWeeklyBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_COUNT_WEEKLY_BAR_CHART, transformedParams])
  }, {})
}

export const useCountWeeklyBarPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarPieChart>([EPath.STATS_COUNT_WEEKLY_BAR_PIE_CHART, transformedParams])
  }, {})
}

export const useCountMonthlyTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ITableData>([EPath.STATS_COUNT_MONTHLY_TABLE, transformedParams])
  }, {})
}

export const useCountMonthlyBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_COUNT_MONTHLY_BAR_CHART, transformedParams])
  }, {})
}

export const useCountMonthlyBarPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarPieChart>([EPath.STATS_COUNT_MONTHLY_BAR_PIE_CHART, transformedParams])
  }, {})
}

export const useCountWeekDayTable = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ITableData>([EPath.STATS_COUNT_WEEK_DAY_TABLE, transformedParams])
  }, {})
}

export const useCountWeekDayBarChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarChart>([EPath.STATS_COUNT_WEEK_DAY_BAR_CHART, transformedParams])
  }, {})
}

export const useCountWeekDayBarPieChart = () => {
  return useMutation((params: IStatisticsReq) => {
    const transformedParams = transformStatisticsParams(params)

    return createGet<ICountBarPieChart>([EPath.STATS_COUNT_WEEK_DAY_BAR_PIE_CHART, transformedParams])
  }, {})
}

export const useConfig = (companyNo: number) => {
  const url = EPath.STATS_CONFIG.replace('{companyNo}', companyNo.toString())

  return useQuery<MResult<IConfig>>([url])
}

export const useConfigMulti = () => {
  return useMutation((params: IConfigMulti) => {
    return createPut<MResult>([EPath.STATS_CONFIG_MULTI, params])
  }, {})
}
